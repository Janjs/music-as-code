#!/usr/bin/env node

import { accessSync, constants } from "node:fs";
import { extname, resolve } from "node:path";
import { platform } from "node:os";
import { spawn, spawnSync } from "node:child_process";

const DOWNLOAD_URL = "https://supercollider.github.io/downloads";
const source = process.argv[2];

function fail(message) {
  console.error(message);
  process.exit(2);
}

if (!source) {
  fail("usage: supercollider-open.mjs <file.scd>");
}

const file = resolve(source);
if (extname(file).toLowerCase() !== ".scd") {
  fail(`expected a .scd file: ${file}`);
}

try {
  accessSync(file, constants.R_OK);
} catch {
  fail(`cannot read file: ${file}`);
}

const system = platform();

if (system === "darwin") {
  const result = spawnSync("open", ["-a", "SuperCollider", file], {
    encoding: "utf8",
  });

  if (result.status !== 0) {
    fail(`SuperCollider is not installed or could not be opened. Install it from ${DOWNLOAD_URL}`);
  }
} else if (system === "linux") {
  await new Promise((done) => {
    const child = spawn("scide", [file], { detached: true, stdio: "ignore" });
    child.once("error", () => {
      fail(`SuperCollider IDE (scide) was not found. Install it from ${DOWNLOAD_URL}`);
    });
    child.once("spawn", () => {
      child.unref();
      done();
    });
  });
} else if (system === "win32") {
  const result = spawnSync("explorer.exe", [file], { stdio: "ignore" });
  if (result.status !== 0) {
    fail(`The .scd file could not be opened. Install SuperCollider from ${DOWNLOAD_URL}`);
  }
} else {
  fail(`automatic opening is not supported on ${system}. Install SuperCollider from ${DOWNLOAD_URL}`);
}

console.log(`opened: ${file}`);
