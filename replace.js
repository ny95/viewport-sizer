const fs = require('fs');
const path = require('path');

const ALLOWED_EXT = new Set(['.tsx', '.ts', '.jsx', '.js']);

function replaceInFile(filePath) {
  const ext = path.extname(filePath);
  if (!ALLOWED_EXT.has(ext)) return;
  if (filePath.includes('node_modules')) return;

  let content;
  try { content = fs.readFileSync(filePath, 'utf8'); } catch { return; }

  const updated = content
    .replace(/100svh/g, 'var(--cvh)')
    .replace(/100vh/g, 'var(--cvh)')
    .replace(/100vw/g, 'var(--cvw)');

  if (updated !== content) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log('[viewport-sizer] fixed:', path.relative(process.cwd(), filePath));
  }
}

// Support: node replace.js <file> OR pipe JSON from Claude Code hook stdin
const arg = process.argv[2];
if (arg) {
  replaceInFile(path.resolve(arg));
} else if (!process.stdin.isTTY) {
  const chunks = [];
  process.stdin.on('data', d => chunks.push(d));
  process.stdin.on('end', () => {
    try {
      const input = JSON.parse(Buffer.concat(chunks).toString());
      const f = input.tool_input?.file_path;
      if (f) replaceInFile(path.resolve(f));
    } catch {}
  });
}

module.exports = { replaceInFile };
