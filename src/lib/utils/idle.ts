export function afterPaint(cb: () => void): void {
	requestAnimationFrame(() => requestAnimationFrame(() => cb()));
}

export function onIdle(cb: () => void, timeout = 1000): void {
	if (typeof requestIdleCallback === 'function') {
		requestIdleCallback(() => cb(), { timeout });
	} else {
		setTimeout(cb, 1);
	}
}
