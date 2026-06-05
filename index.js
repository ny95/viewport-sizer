function resize(p) {
	if (typeof window === 'undefined') {
		if (typeof globalThis !== 'undefined' && globalThis.addEventListener) {
			globalThis.addEventListener('load', () => resize(p));
		}
		return;
	}
	let w = 0, h = 0;
	if (p) { w = p?.width, h = p?.height }
	if (w && isNaN(w)) { throw new Error("resize width parameters must be number"); }
	if (h && isNaN(h)) { throw new Error("resize height parameters must be number"); }
	const b = document.body, wn = window;
	if (!document.querySelector('style[data-viewport-sizer]')) {
		const s = document.createElement('style');
		s.setAttribute('data-viewport-sizer', '');
		s.textContent = ':root { --cvw: 100vw; --cvh: 100vh; }';
		document.head.appendChild(s);
	}
	if (!w) {
		w = screen.width * wn.devicePixelRatio;
		w = +(w - w / 10).toFixed(2);
	}
	let mmt = 1200;
	let cw = b.offsetWidth;
	const ct = b.style.cssText;
	let z = +document.body.style.zoom || 1;
	b.style.cssText = ct + `zoom:${z};`;
	const s = document.querySelector('style[data-viewport-sizer]');
	if (cw < w) {
		while (cw <= w && cw > mmt) {
			z = z - 0.01;
			b.style.cssText = ct + `zoom:${z};`;
			cw = b.offsetWidth;
			s.textContent = `:root { --cvw: ${cw}px; --cvh: ${h ? h : (wn.innerHeight / z)}px; }`;
		}
	} else {
		while (cw >= w && w > mmt) {
			z = z + 0.01;
			b.style.cssText = ct + `zoom:${z};`;
			cw = b.offsetWidth;
			s.textContent = `:root { --cvw: ${cw}px; --cvh: ${h ? h : (wn.innerHeight / z)}px; }`;
		}
	}
	
	if (!window.__viewportSizerListening) {
		window.__viewportSizerListening = true;

		window.addEventListener('popstate', () => resize(p));

		const _patch = (method) => {
			const original = history[method].bind(history);
			history[method] = function (...args) {
				original(...args);
				resize(p);
			};
		};
		_patch('pushState');
		_patch('replaceState');
	}
}

module.exports = { resize };
