#!/usr/bin/env node
import fs from 'node:fs';

const file = process.argv[2];
if (!file) {
  console.error('Usage: node strudel-url.mjs <file.strudel.js>');
  process.exit(1);
}

const code = fs.readFileSync(file, 'utf8');
console.log(`https://strudel.cc/#${encodeURIComponent(code)}`);
