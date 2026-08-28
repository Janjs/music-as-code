#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const file = process.argv[2];
if (!file) {
  console.error('Usage: node lilypond-compile.mjs <file.ly>');
  process.exit(1);
}

const abs = path.resolve(file);
if (!fs.existsSync(abs)) {
  console.error(`File not found: ${file}`);
  process.exit(1);
}

const probe = spawnSync('lilypond', ['--version'], { encoding: 'utf8' });
if (probe.error) {
  console.error('lilypond not found. Install: brew install lilypond');
  console.error('https://lilypond.org');
  process.exit(2);
}

const outBase = path.join(path.dirname(abs), path.parse(abs).name);
const result = spawnSync(
  'lilypond',
  ['-dno-point-and-click', '-o', outBase, abs],
  { encoding: 'utf8' },
);
if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);
if (result.status !== 0) process.exit(result.status ?? 1);

const pdf = `${outBase}.pdf`;
const midi = [`${outBase}.midi`, `${outBase}.mid`].find((p) => fs.existsSync(p));
if (!fs.existsSync(pdf)) {
  console.error('lilypond exited 0 but no PDF was written');
  process.exit(1);
}
console.log(`pdf: ${pdf}`);
if (midi) console.log(`midi: ${midi}`);
