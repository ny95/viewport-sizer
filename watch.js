#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { replaceInFile } = require('./replace');

const srcDir = path.resolve(process.argv[2] || 'src');

if (!fs.existsSync(srcDir)) {
  console.error('[viewport-sizer] Directory not found:', srcDir);
  process.exit(1);
}

const pending = new Map();
function handle(filePath) {
  if (pending.has(filePath)) clearTimeout(pending.get(filePath));
  pending.set(filePath, setTimeout(() => {
    pending.delete(filePath);
    replaceInFile(filePath);
  }, 100));
}

fs.watch(srcDir, { recursive: true }, (_, filename) => {
  if (filename) handle(path.join(srcDir, filename));
});

console.log('[viewport-sizer] Watching', srcDir);
