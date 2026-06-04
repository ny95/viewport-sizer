const VW_RE = /\b100(s|d|l)?vw\b/g;
const VH_RE = /\b100(s|d|l)?vh\b/g;

const plugin = (opts = {}) => {
	const vw = opts.vw || '--cvw';
	const vh = opts.vh || '--cvh';
	return {
		postcssPlugin: 'viewport-sizer',
		Declaration(decl) {
			if (VW_RE.test(decl.value)) {
				decl.value = decl.value.replace(VW_RE, `var(${vw})`);
			}
			if (VH_RE.test(decl.value)) {
				decl.value = decl.value.replace(VH_RE, `var(${vh})`);
			}
		}
	};
};
plugin.postcss = true;
module.exports = plugin;
