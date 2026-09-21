<script lang="ts">
	import { onMount } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import { browser } from '$app/environment';
	import { afterNavigate, beforeNavigate, goto } from '$app/navigation';

	interface Props {
		coverDuration?: number;

		holdDuration?: number;

		dissolveDuration?: number;

		cellSize?: number;
	}

	let {
		coverDuration = 650,
		holdDuration = 140,
		dissolveDuration = 800,
		cellSize = 14
	}: Props = $props();

	const GLYPHS = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&@$*+=/\\|<>{}[]():;,.!?~^-_'];

	const F2 = 0.5 * (Math.sqrt(3) - 1);
	const G2 = (3 - Math.sqrt(3)) / 6;
	const GRAD2 = [
		[1, 1],
		[-1, 1],
		[1, -1],
		[-1, -1],
		[1, 0],
		[-1, 0],
		[0, 1],
		[0, -1]
	];

	let perm = new Uint8Array(512);

	function seedNoise(seed: number) {
		const p = new Uint8Array(256);
		for (let i = 0; i < 256; i++) p[i] = i;
		let s = seed | 0;
		for (let i = 255; i > 0; i--) {
			s = (s + 0x6d2b79f5) | 0;
			let t = Math.imul(s ^ (s >>> 15), 1 | s);
			t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
			const j = ((t ^ (t >>> 14)) >>> 0) % (i + 1);
			const tmp = p[i];
			p[i] = p[j];
			p[j] = tmp;
		}
		perm = new Uint8Array(512);
		for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
	}

	function simplex2(x: number, y: number): number {
		const s = (x + y) * F2;
		const i = Math.floor(x + s);
		const j = Math.floor(y + s);
		const t = (i + j) * G2;
		const x0 = x - (i - t);
		const y0 = y - (j - t);
		const i1 = x0 > y0 ? 1 : 0;
		const j1 = x0 > y0 ? 0 : 1;
		const x1 = x0 - i1 + G2;
		const y1 = y0 - j1 + G2;
		const x2 = x0 - 1 + 2 * G2;
		const y2 = y0 - 1 + 2 * G2;
		const ii = i & 255;
		const jj = j & 255;
		let n = 0;
		let d = 0.5 - x0 * x0 - y0 * y0;
		if (d > 0) {
			d *= d;
			const g = GRAD2[perm[ii + perm[jj]] & 7];
			n += d * d * (g[0] * x0 + g[1] * y0);
		}
		d = 0.5 - x1 * x1 - y1 * y1;
		if (d > 0) {
			d *= d;
			const g = GRAD2[perm[ii + i1 + perm[jj + j1]] & 7];
			n += d * d * (g[0] * x1 + g[1] * y1);
		}
		d = 0.5 - x2 * x2 - y2 * y2;
		if (d > 0) {
			d *= d;
			const g = GRAD2[perm[ii + 1 + perm[jj + 1]] & 7];
			n += d * d * (g[0] * x2 + g[1] * y2);
		}
		return 70 * n;
	}

	function fbm(x: number, y: number, time: number, octaves: number): number {
		let sum = 0;
		let amp = 1;
		let norm = 0;
		let fx = x;
		let fy = y;
		for (let o = 0; o < octaves; o++) {
			const dx = Math.cos(o * 2.399 + 1.7);
			const dy = Math.sin(o * 2.399 + 4.1);
			sum += amp * simplex2(fx + time * dx, fy + time * dy);
			norm += amp;
			amp *= 0.5;
			fx *= 2;
			fy *= 2;
		}
		return sum / norm;
	}

	function warpedField(x: number, y: number, time: number, seedOff: number): number {
		const wx = fbm(x + 5.2 + seedOff, y + 1.3, time * 0.6, 2);
		const wy = fbm(x - 1.7, y + 9.2 + seedOff, time * 0.6, 2);
		return fbm(x + 0.9 * wx, y + 0.9 * wy, time, 4);
	}

	let canvasEl: HTMLCanvasElement | undefined;
	let ctx: CanvasRenderingContext2D | null = null;
	let paper = '#000';
	let ink = '#fff';

	let cols = 0;
	let rows = 0;
	let cellW = 8;
	let cellH = 14;
	let dpr = 1;
	let glyphIdx = new Uint8Array(0);
	let atlas: HTMLCanvasElement | undefined;
	let atlasCellW = 0;
	let atlasCellH = 0;

	let phase = $state<'idle' | 'cover' | 'dissolve'>('idle');

	let phaseStart = 0;
	let rafId = 0;
	let running = false;
	let coverResolve: (() => void) | undefined;
	let dissolveResolve: (() => void) | undefined;

	let busy = false;

	let currentPath = '/';
	const swapSettlers = new SvelteSet<() => void>();

	const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
	const easeOutQuart = (t: number) => 1 - (1 - t) ** 4;
	const smoothstep = (a: number, b: number, x: number) => {
		const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
		return t * t * (3 - 2 * t);
	};
	const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

	function buildAtlas() {
		const src = atlas ?? document.createElement('canvas');
		atlas = src;
		const actx = src.getContext('2d');
		if (!actx) return;
		atlasCellW = Math.max(1, Math.round(cellW * dpr));
		atlasCellH = Math.max(1, Math.round(cellH * dpr));
		src.width = atlasCellW * GLYPHS.length;
		src.height = atlasCellH;
		actx.clearRect(0, 0, src.width, src.height);
		actx.font = `${cellH * dpr}px GeistMono, ui-monospace, monospace`;
		actx.textAlign = 'center';
		actx.textBaseline = 'middle';
		actx.fillStyle = ink;
		for (let g = 0; g < GLYPHS.length; g++) {
			actx.fillText(GLYPHS[g], atlasCellW * (g + 0.5), atlasCellH * 0.54);
		}
	}

	function rebuildGrid(width: number, height: number) {
		if (!canvasEl || width <= 0 || height <= 0) return;
		ctx = canvasEl.getContext('2d');
		if (!ctx) return;
		dpr = Math.min(2, window.devicePixelRatio || 1);
		canvasEl.width = Math.max(1, Math.round(width * dpr));
		canvasEl.height = Math.max(1, Math.round(height * dpr));
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

		ctx.font = `${cellSize}px GeistMono, ui-monospace, monospace`;
		const advance = ctx.measureText('M').width || cellSize * 0.6;
		cellW = advance;
		cellH = cellSize * 1.12;
		cols = Math.ceil(width / cellW);
		rows = Math.ceil(height / cellH);

		const cells = cols * rows;
		if (glyphIdx.length !== cells) glyphIdx = new Uint8Array(cells);
		for (let c = 0; c < cells; c++) glyphIdx[c] = (Math.random() * GLYPHS.length) | 0;
		buildAtlas();
	}

	function drawFrame(now: number): number {
		if (!ctx || !atlas || cols === 0 || rows === 0) return phase === 'idle' ? 1 : 0;
		const dissolving = phase === 'dissolve';
		const raw = Math.min(1, (now - phaseStart) / (dissolving ? dissolveDuration : coverDuration));
		const p = dissolving ? easeInOutCubic(raw) : easeOutQuart(raw);

		const T = (dissolving ? 1 - p : p) * 1.1;
		const time = now * 0.00035;
		const seedOff = dissolving ? 37.1 : 0;

		const unitsPerPx = 5.2 / (cols * cellW);
		const churn = dissolving ? 0.12 : 0.08;

		const bgAlpha = dissolving ? 1 - smoothstep(0, 0.3, p) : smoothstep(0.62, 0.95, p);
		ctx.clearRect(0, 0, cols * cellW, rows * cellH);
		if (bgAlpha > 0) {
			ctx.globalAlpha = bgAlpha;
			ctx.fillStyle = paper;
			ctx.fillRect(0, 0, cols * cellW, rows * cellH);
			ctx.globalAlpha = 1;
		}

		for (let r = 0; r < rows; r++) {
			const fy = r * cellH * unitsPerPx;
			const rowY = r * cellH;
			const rowBase = r * cols;
			for (let c = 0; c < cols; c++) {
				const fx = c * cellW * unitsPerPx;

				const f = 0.5 + 0.5 * warpedField(fx, fy, time, seedOff);
				if (f > T) continue;
				const idx = rowBase + c;

				if (Math.abs(f - T) < 0.05 || Math.random() < churn) {
					glyphIdx[idx] = (Math.random() * GLYPHS.length) | 0;
				}
				const g = glyphIdx[idx];
				ctx.drawImage(
					atlas,
					g * atlasCellW,
					0,
					atlasCellW,
					atlasCellH,
					c * cellW,
					rowY,
					cellW,
					cellH
				);
			}
		}
		return p;
	}

	function loop(now: number) {
		if (!running) return;
		rafId = requestAnimationFrame(loop);
		const p = drawFrame(now);
		if (p < 1) return;
		if (phase === 'cover') {
			if (coverResolve) {
				coverResolve();
				coverResolve = undefined;
			}
		} else if (phase === 'dissolve') {
			stopLoop();
			phase = 'idle';
			if (dissolveResolve) {
				dissolveResolve();
				dissolveResolve = undefined;
			}
		}
	}

	function startLoop() {
		if (running) return;
		running = true;
		rafId = requestAnimationFrame(loop);
	}

	function stopLoop() {
		running = false;
		cancelAnimationFrame(rafId);
		ctx?.clearRect(0, 0, canvasEl?.width ?? 0, canvasEl?.height ?? 0);
	}

	function beginCover(): Promise<void> {
		return new Promise((resolve) => {
			phase = 'cover';
			phaseStart = performance.now();
			coverResolve = resolve;
			startLoop();

			setTimeout(resolve, coverDuration + 1500);
		});
	}

	function beginDissolve(): Promise<void> {
		return new Promise((resolve) => {
			phase = 'dissolve';
			phaseStart = performance.now();
			dissolveResolve = resolve;
			startLoop();
			setTimeout(resolve, dissolveDuration + 1500);
		});
	}

	function settleSwap(): Promise<void> {
		return new Promise((resolve) => {
			const done = () => {
				swapSettlers.delete(done);
				clearTimeout(failsafe);
				resolve();
			};
			const failsafe = setTimeout(done, 5000);
			swapSettlers.add(done);
		});
	}

	async function runTransition(to: URL, replaceState = false) {
		busy = true;
		try {
			const styles = getComputedStyle(document.documentElement);
			paper = styles.getPropertyValue('--ascii-transition-bg').trim() || '#000';
			ink = styles.getPropertyValue('--ascii-transition-color').trim() || '#fff';
			buildAtlas();

			await beginCover();

			if (currentPath !== to.pathname) {
				const settled = settleSwap();

				goto(to.href, { keepFocus: true, replaceState }).catch(() => {});
				await settled;
			}

			await wait(holdDuration);
			await beginDissolve();
		} finally {
			if (phase !== 'idle') {
				stopLoop();
				phase = 'idle';
			}
			busy = false;
		}
	}

	if (browser) {
		beforeNavigate((nav) => {
			if (busy) return;

			if (nav.type !== 'link' && nav.type !== 'popstate' && nav.type !== 'form') return;
			if (!nav.to || nav.willUnload) return;
			if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
			const to = nav.to.url;
			if (to.origin !== window.location.origin) return;

			if (to.pathname === currentPath) return;
			nav.cancel();
			void runTransition(to, nav.type === 'popstate');
		});

		afterNavigate(() => {
			currentPath = window.location.pathname;

			for (const settle of [...swapSettlers]) settle();

			if (busy && phase === 'cover' && coverResolve) {
				coverResolve();
				coverResolve = undefined;
			}
		});
	}

	onMount(() => {
		const canvas = canvasEl;
		if (!canvas) return;

		currentPath = window.location.pathname;

		document.fonts
			?.load(`${cellSize}px GeistMono`)
			.then(buildAtlas)
			.catch(() => {});
		seedNoise(0x5eed);
		rebuildGrid(window.innerWidth, window.innerHeight);

		const ro = new ResizeObserver(() => {
			rebuildGrid(
				canvas.clientWidth || window.innerWidth,
				canvas.clientHeight || window.innerHeight
			);
		});
		ro.observe(canvas);

		return () => {
			ro.disconnect();
			stopLoop();
			phase = 'idle';
			busy = false;
			coverResolve?.();
			dissolveResolve?.();
			coverResolve = undefined;
			dissolveResolve = undefined;
			for (const settle of [...swapSettlers]) settle();
			atlas = undefined;
			ctx = null;
		};
	});

	const active = $derived(phase !== 'idle');
</script>

<canvas
	bind:this={canvasEl}
	aria-hidden="true"
	class="fixed inset-0 z-[2147483647] h-full w-full {active
		? 'pointer-events-auto'
		: 'pointer-events-none opacity-0'}"
></canvas>
