// Measure the TextRings hero's actual draw rate in a production build.
//
// TextRings.draw() fills its background with exactly one full-canvas
// fillRect per rendered frame, so counting full-canvas fillRects per second
// per canvas gives the real fps of every canvas on the page.
//
// Usage (server must already be running, see scripts/lh-mobile.sh):
//   CHROME_PATH=$(find ~/.cache/ms-playwright -name chrome-headless-shell -type f | head -1) \
//   bun scripts/fps-probe.ts [url]
import { chromium } from '@playwright/test';

const url = process.argv[2] ?? 'http://localhost:4173/';

const browser = await chromium.launch({
	executablePath: process.env.CHROME_PATH,
	args: ['--no-sandbox', '--disable-dev-shm-usage']
});

async function probe(width: number, height: number, label: string) {
	const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2 });
	const page = await ctx.newPage();
	// plain JS: addInitScript serializes the function into the page
	await page.addInitScript(() => {
		window.__fpsCounts = new WeakMap();
		const orig = CanvasRenderingContext2D.prototype.fillRect;
		CanvasRenderingContext2D.prototype.fillRect = function (x, y, w, h) {
			const cv = this.canvas;
			if (w === cv.width && h === cv.height) {
				const m = window.__fpsCounts;
				m.set(cv, (m.get(cv) ?? 0) + 1);
			}
			return orig.call(this, x, y, w, h);
		};
	});
	await page.goto(url, { waitUntil: 'load' });
	// let the deferred bake + intro wave settle before sampling
	await page.waitForTimeout(4000);
	const rows = await page.evaluate(async () => {
		const m = window.__fpsCounts;
		const cvs = Array.from(document.querySelectorAll('canvas'));
		const before = cvs.map((c) => m.get(c) ?? 0);
		const t0 = performance.now();
		await new Promise((r) => setTimeout(r, 3000));
		const secs = (performance.now() - t0) / 1000;
		return cvs
			.map((c, i) => ({
				size: `${c.width}x${c.height}`,
				fps: ((m.get(c) ?? 0) - before[i]) / secs
			}))
			.filter((r) => r.fps > 0.5);
	});
	console.log(`${label} (${width}x${height}):`, JSON.stringify(rows));
	await ctx.close();
}

await probe(1280, 800, 'desktop');
await probe(390, 840, 'mobile');
await browser.close();
