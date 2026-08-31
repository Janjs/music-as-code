#!/usr/bin/env node

import { accessSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { constants } from "node:fs";
import { homedir, platform, tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { spawn } from "node:child_process";

const target = process.argv[2];

if (!target) {
  console.error("usage: supercollider-check.mjs <file.scd>");
  process.exit(2);
}

const file = resolve(target);

try {
  accessSync(file, constants.R_OK);
  readFileSync(file, "utf8");
} catch {
  console.error(`not readable: ${file}`);
  process.exit(2);
}

if (!file.endsWith(".scd")) {
  console.error(`expected a .scd file: ${file}`);
  process.exit(2);
}

const macCandidates = [
  "/Applications/SuperCollider.app/Contents/MacOS/sclang",
  join(homedir(), "Applications/SuperCollider.app/Contents/MacOS/sclang"),
];

const absoluteCandidate = [process.env.SCLANG_PATH, ...macCandidates]
  .filter(Boolean)
  .find((candidate) => {
    try {
      accessSync(candidate, constants.X_OK);
      return true;
    } catch {
      return false;
    }
  });

const command = absoluteCandidate ?? "sclang";
const work = mkdtempSync(join(tmpdir(), "music-as-code-sc-"));
const wrapper = join(work, "check.scd");

writeFileSync(
  wrapper,
  `try {\n  thisProcess.interpreter.compileFile(${JSON.stringify(file)});\n  "MUSIC_AS_CODE_CHECK_OK".postln;\n  0.exit;\n} { |error|\n  ("MUSIC_AS_CODE_CHECK_ERROR: " ++ error.asString).postln;\n  1.exit;\n};\n`,
);

const child = spawn(command, [wrapper], {
  cwd: absoluteCandidate && platform() === "darwin" ? dirname(command) : process.cwd(),
  env: platform() === "linux"
    ? { ...process.env, QT_QPA_PLATFORM: process.env.QT_QPA_PLATFORM ?? "offscreen" }
    : process.env,
  stdio: ["ignore", "pipe", "pipe"],
});

let output = "";
child.stdout.on("data", (chunk) => { output += chunk; });
child.stderr.on("data", (chunk) => { output += chunk; });
child.on("error", (error) => {
  rmSync(work, { recursive: true, force: true });
  const hint = command === "sclang"
    ? "Install SuperCollider or set SCLANG_PATH to its sclang executable."
    : error.message;
  console.error(`SuperCollider unavailable: ${hint}`);
  process.exit(2);
});

const timer = setTimeout(() => child.kill("SIGTERM"), 20_000);

child.on("close", () => {
  clearTimeout(timer);
  rmSync(work, { recursive: true, force: true });

  if (output.includes("MUSIC_AS_CODE_CHECK_OK")) {
    console.log(`ok: ${basename(file)}`);
    process.exit(0);
  }

  const useful = output
    .split(/\r?\n/)
    .filter((line) => /ERROR|syntax|MUSIC_AS_CODE|unexpected|parse/i.test(line))
    .join("\n");
  console.error(useful || output.trim() || `check failed: ${file}`);
  process.exit(1);
});
