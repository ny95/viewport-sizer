const DESKTOP_MIN_WIDTH = 1024;

const MOBILE_DEFAULTS = ':root { ' +
	'--cvw: 100vw; --csvw: 100svw; --cdvw: 100dvw; --clvw: 100lvw; ' +
	'--cvh: 100vh; --csvh: 100svh; --cdvh: 100dvh; --clvh: 100lvh; }';

let _resizeDebounceTimer;
let _currentParams;
let _styleEl = null;

function _buildDesktopVars(cw, cvh) {
	return ':root { ' +
		`--cvw: ${cw}px; --csvw: ${cw}px; --cdvw: ${cw}px; --clvw: ${cw}px; ` +
		`--cvh: ${cvh}px; --csvh: ${cvh}px; --cdvh: ${cvh}px; --clvh: ${cvh}px; }`;
}

function _getOrCreateStyle() {
	if (_styleEl && _styleEl.isConnected) return _styleEl;
	_styleEl = document.querySelector('style[data-viewport-sizer]');
	if (!_styleEl) {
		_styleEl = document.createElement('style');
		_styleEl.setAttribute('data-viewport-sizer', '');
		_styleEl.textContent = MOBILE_DEFAULTS;
		document.head.appendChild(_styleEl);
	}
	return _styleEl;
}

function resize(p) {
	_currentParams = p;

	if (typeof window === 'undefined') {
		if (typeof globalThis !== 'undefined' && globalThis.addEventListener) {
			globalThis.addEventListener('load', () => resize(_currentParams));
		}
		return;
	}

	if (!document.body) {
		document.addEventListener('DOMContentLoaded', () => resize(_currentParams), { once: true });
		return;
	}

	let w = 0, h = 0;
	if (p) { w = p?.width, h = p?.height }
	if (w && isNaN(w)) { throw new Error("resize width parameters must be number"); }
	if (h && isNaN(h)) { throw new Error("resize height parameters must be number"); }
	const b = document.body, wn = window;
	const s = _getOrCreateStyle();

	if (!window.__viewportSizerListening) {
		window.__viewportSizerListening = true;

		window.addEventListener('resize', () => {
			clearTimeout(_resizeDebounceTimer);
			_resizeDebounceTimer = setTimeout(() => resize(_currentParams), 150);
		});

		window.addEventListener('popstate', () => resize(_currentParams));

		const _patch = (method) => {
			const original = history[method].bind(history);
			history[method] = function (...args) {
				original(...args);
				resize(_currentParams);
			};
		};
		_patch('pushState');
		_patch('replaceState');
	}

	if (wn.innerWidth < DESKTOP_MIN_WIDTH) {
		b.style.zoom = '';
		s.textContent = MOBILE_DEFAULTS;
		return;
	}

	if (!w) {
		w = screen.width * wn.devicePixelRatio;
		w = +(w - w / 10).toFixed(2);
	}
	let mmt = 1200;
	const ct = b.style.cssText.replace(/(?<![a-zA-Z0-9-])zoom\s*:[^;]+;?\s*/g, '');
	let cw = b.offsetWidth;
	let z = +document.body.style.zoom || 1;
	b.style.cssText = ct + `zoom:${z};`;

	let loopRan = false;
	if (cw < w) {
		while (cw <= w && cw > mmt) {
			if (z <= 0.1) break;
			z = z - 0.01;
			b.style.cssText = ct + `zoom:${z};`;
			cw = b.offsetWidth;
			s.textContent = _buildDesktopVars(cw, h ? h : (wn.innerHeight / z));
			loopRan = true;
		}
	} else {
		while (cw >= w && w > mmt) {
			if (z >= 10) break;
			z = z + 0.01;
			b.style.cssText = ct + `zoom:${z};`;
			cw = b.offsetWidth;
			s.textContent = _buildDesktopVars(cw, h ? h : (wn.innerHeight / z));
			loopRan = true;
		}
	}
	if (!loopRan) {
		s.textContent = _buildDesktopVars(cw, h ? h : (wn.innerHeight / z));
	}
}

module.exports = { resize };
