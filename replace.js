const fs = require('fs');
const path = require('path');

const ALLOWED_EXT = new Set(['.tsx', '.ts', '.jsx', '.js']);

const REPLACEMENTS = [
	[/\b100svw\b/g, 'var(--csvw)'],
	[/\b100dvw\b/g, 'var(--cdvw)'],
	[/\b100lvw\b/g, 'var(--clvw)'],
	[/\b100vw\b/g,  'var(--cvw)'],
	[/\b100svh\b/g, 'var(--csvh)'],
	[/\b100dvh\b/g, 'var(--cdvh)'],
	[/\b100lvh\b/g, 'var(--clvh)'],
	[/\b100vh\b/g,  'var(--cvh)'],
];

function replaceViewportUnits(str) {
	let result = str;
	for (const [pattern, replacement] of REPLACEMENTS) {
		result = result.replace(pattern, replacement);
	}
	return result;
}

function processContent(content) {
	return content.replace(
		/(["'`])((?:\\[\s\S]|(?!\1)[^\\])*)\1/g,
		(_, quote, inner) => quote + replaceViewportUnits(inner) + quote
	);
}

function replaceInFile(filePath) {
	const ext = path.extname(filePath);
	if (!ALLOWED_EXT.has(ext)) return;
	if (filePath.includes('node_modules')) return;

	let content;
	try { content = fs.readFileSync(filePath, 'utf8'); } catch { return; }

	const updated = processContent(content);

	if (updated !== content) {
		fs.writeFileSync(filePath, updated, 'utf8');
		console.log('[viewport-sizer] fixed:', path.relative(process.cwd(), filePath));
	}
}

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
