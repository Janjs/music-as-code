#!/usr/bin/env node
import fs from 'node:fs';

const file = process.argv[2];
if (!file) {
  console.error('Usage: node lilypond-url.mjs <file.ly>');
  process.exit(1);
}

const code = fs.readFileSync(file, 'utf8');
console.log(`https://www.hacklily.org/wasm#src=${encodeURIComponent(code)}`);
