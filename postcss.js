const plugin = (opts = {}) => {
	const vw = opts.vw || '--cvw';
	const vh = opts.vh || '--cvh';
	return {
		postcssPlugin: 'viewport-sizer',
		Declaration(decl) {
			if (decl.value.includes('100vw')) {
				decl.value = decl.value.replace(/100vw/g, `var(${vw})`);
			}
			if (decl.value.includes('100vh')) {
				decl.value = decl.value.replace(/100vh/g, `var(${vh})`);
			}
		}
	};
};
plugin.postcss = true;
module.exports = plugin;
