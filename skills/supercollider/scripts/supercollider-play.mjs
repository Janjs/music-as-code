#!/usr/bin/env node

import { accessSync, constants } from "node:fs";
import { homedir, platform } from "node:os";
import { dirname, extname, join, resolve } from "node:path";
import { spawn } from "node:child_process";

const source = process.argv[2];

function fail(message) {
  console.error(message);
  process.exit(2);
}

if (!source) fail("usage: supercollider-play.mjs <file.scd>");

const file = resolve(source);
if (extname(file).toLowerCase() !== ".scd") fail(`expected a .scd file: ${file}`);

try {
  accessSync(file, constants.R_OK);
} catch {
  fail(`cannot read file: ${file}`);
}

const candidates = [
  process.env.SCLANG_PATH,
  "/Applications/SuperCollider.app/Contents/MacOS/sclang",
  join(homedir(), "Applications/SuperCollider.app/Contents/MacOS/sclang"),
].filter(Boolean);

const installed = candidates.find((candidate) => {
  try {
    accessSync(candidate, constants.X_OK);
    return true;
  } catch {
    return false;
  }
});

const command = installed ?? "sclang";
const child = spawn(command, [], {
  cwd: installed && platform() === "darwin" ? dirname(command) : process.cwd(),
  env: platform() === "linux"
    ? { ...process.env, QT_QPA_PLATFORM: process.env.QT_QPA_PLATFORM ?? "offscreen" }
    : process.env,
  stdio: ["pipe", "pipe", "pipe"],
});

let startup = "";
let loaded = false;

function forward(chunk, stream) {
  stream.write(chunk);
  if (loaded) return;
  startup = `${startup}${chunk}`.slice(-4096);
  if (!startup.includes("Welcome to SuperCollider")) return;

  loaded = true;
  child.stdin.write(
    `Server.default.options.numInputBusChannels = 0; thisProcess.interpreter.executeFile(${JSON.stringify(file)});\n`,
  );
  console.log(`playing: ${file}`);
  console.log("Press Ctrl-C to stop.");
}

child.stdout.on("data", (chunk) => forward(chunk, process.stdout));
child.stderr.on("data", (chunk) => forward(chunk, process.stderr));
child.on("error", () => {
  fail("SuperCollider is not installed. Install it from https://supercollider.github.io/downloads");
});
child.on("close", (code) => process.exit(code ?? 0));

process.on("SIGINT", () => {
  if (!child.killed) {
    child.stdin.write("CmdPeriod.run; Server.default.quit; 0.exit;\n");
    setTimeout(() => child.kill("SIGTERM"), 2000).unref();
  }
});
