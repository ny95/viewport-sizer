const VW_RE  = /\b100vw\b/g;
const SVW_RE = /\b100svw\b/g;
const DVW_RE = /\b100dvw\b/g;
const LVW_RE = /\b100lvw\b/g;
const VH_RE  = /\b100vh\b/g;
const SVH_RE = /\b100svh\b/g;
const DVH_RE = /\b100dvh\b/g;
const LVH_RE = /\b100lvh\b/g;

const plugin = (opts = {}) => {
	const vw  = opts.vw  || '--cvw';
	const svw = opts.svw || '--csvw';
	const dvw = opts.dvw || '--cdvw';
	const lvw = opts.lvw || '--clvw';
	const vh  = opts.vh  || '--cvh';
	const svh = opts.svh || '--csvh';
	const dvh = opts.dvh || '--cdvh';
	const lvh = opts.lvh || '--clvh';
	return {
		postcssPlugin: 'viewport-sizer',
		Declaration(decl) {
			if (!decl.value.includes('100')) return;
			if (decl.value.includes('100svw')) decl.value = decl.value.replace(SVW_RE, `var(${svw})`);
			if (decl.value.includes('100dvw')) decl.value = decl.value.replace(DVW_RE, `var(${dvw})`);
			if (decl.value.includes('100lvw')) decl.value = decl.value.replace(LVW_RE, `var(${lvw})`);
			if (decl.value.includes('100vw'))  decl.value = decl.value.replace(VW_RE,  `var(${vw})`);
			if (decl.value.includes('100svh')) decl.value = decl.value.replace(SVH_RE, `var(${svh})`);
			if (decl.value.includes('100dvh')) decl.value = decl.value.replace(DVH_RE, `var(${dvh})`);
			if (decl.value.includes('100lvh')) decl.value = decl.value.replace(LVH_RE, `var(${lvh})`);
			if (decl.value.includes('100vh'))  decl.value = decl.value.replace(VH_RE,  `var(${vh})`);
		}
	};
};
plugin.postcss = true;
module.exports = plugin;
