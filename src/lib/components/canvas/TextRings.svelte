<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { SvelteMap } from 'svelte/reactivity';
	import { afterPaint, onIdle } from '$lib/utils/idle';

	interface Props {
		class?: string;

		text?: string;

		ringCount?: number;

		coverage?: number;

		textFraction?: number;

		ink?: string;

		background?: string;

		maxFps?: number;
	}

	let {
		class: className = '',
		text = 'AZUR \u00b7 FULLSTACK ENGINEER \u00b7 SYSTEMS',
		ringCount = 38,
		coverage = 1.9,
		textFraction = 0.6,
		ink = '#f1eee7',
		background = '#232323',
		maxFps = 0
	}: Props = $props();

	const TAU = Math.PI * 2;
	const FONT_FAMILY = 'GeistMono, ui-monospace, SFMono-Regular, Menlo, monospace';
	const DOT_SIZE = 2;
	const DOT_COLOR = 'rgba(241, 238, 231, 0.35)';
	const SEPARATOR_RE = /[\u00b7\u2022\u00b0\u2027\u30fb\u00a0]+/g;
	const FLICKER_START_P = 0.0008;
	const FLICKER_MS = 0.15;
	const PHRASE_DOT_P = 0.18;
	const GAP_COMPRESS = 0.95;
	const CHARGE_FULL_T = 1.2;
	const CHARGE_ZOOM_T = 4;
	const SPRING_K = 120;
	const SPRING_C = 6;
	const WAVE_STEP = 0.03;
	const JITTER_PX = 1.2;
	const JITTER_RAMP = 1.2;
	const JITTER_P = 0.25;
	const RELEASE_LABEL_MS = 700;
	const INTRO_WAVE_STEP = 0.035;
	const INTRO_FADE = 0.35;
	const INTRO_TAIL = 2.5;

	const MOBILE_RING_COUNT = 20;

	const FREE_OFFSCREEN_MS = 2000;

	type Phase = 'idle' | 'charge' | 'spring';

	interface Ring {
		baseR: number;
		font: string;
		fontSize: number;
		atlas: HTMLCanvasElement;
		cellW: number;
		cellH: number;
		index: Map<string, number>;
		n: number;
		cosJ: Float64Array;
		sinJ: Float64Array;
		letters: string[];
		jitters: Uint8Array;
		flickerUntil: Float64Array;
		rf: number;
		chargeFrom: number;
		chargeRf: number;
		alpha: number;
		rv: number;
		releaseAt: number;
		rot: number;
		dir: number;
		speed: number;
	}

	let containerEl: HTMLDivElement | undefined;
	let canvasEl: HTMLCanvasElement | undefined;
	let tooltipEl = $state<HTMLDivElement | undefined>();

	let tooltipLabel = $state('CLICK & HOLD');
	let tooltipVisible = $state(false);

	let ctx: CanvasRenderingContext2D | null = null;
	let cssW = 0;
	let cssH = 0;
	let dpr = 1;
	let cx = 0;
	let cy = 0;
	let rings: Ring[] = [];
	let phase: Phase = 'idle';
	let introT = 0;
	let chargeT = 0;
	let chargeFull = false;
	let jitter = 0;
	let hovering = false;
	let mx = 0;
	let my = 0;
	let maskR2 = 0;
	let advanceRatio = 0.6;

	let raf = 0;
	let last = 0;
	let lastFrame = 0;
	let mobileField = false;
	let visible = false;
	let built = false;
	let buildScheduled = false;
	let destroyed = false;
	let releaseTimer: ReturnType<typeof setTimeout>;
	let freeTimer: ReturnType<typeof setTimeout> | undefined;
	let cleanup: (() => void) | undefined;

	function bakeAtlas(letters: string[], fontSize: number) {
		const index = new SvelteMap<string, number>();
		const chars: string[] = [];
		for (const ch of letters) {
			if (ch && !index.has(ch)) {
				index.set(ch, chars.length);
				chars.push(ch);
			}
		}
		const atlas = document.createElement('canvas');
		const ac = atlas.getContext('2d');
		const cellH = Math.max(1, Math.ceil(fontSize * dpr * 1.6) + 4);
		let cellW = 1;
		if (ac && chars.length > 0) {
			const fontStr = `${(fontSize * dpr).toFixed(2)}px ${FONT_FAMILY}`;
			ac.font = fontStr;
			let maxW = 0;
			for (const ch of chars) {
				const w = ac.measureText(ch).width;
				if (w > maxW) maxW = w;
			}
			cellW = Math.ceil(maxW) + 4;
			atlas.width = cellW * chars.length;
			atlas.height = cellH;

			ac.font = fontStr;
			ac.textAlign = 'center';
			ac.textBaseline = 'middle';
			ac.fillStyle = ink;
			for (let k = 0; k < chars.length; k++) {
				ac.fillText(chars[k], cellW * k + cellW / 2, cellH / 2);
			}
		} else if (atlas) {
			atlas.width = 1;
			atlas.height = 1;
		}
		return { atlas, cellW, cellH, index };
	}

	function buildRings() {
		const c = ctx;
		if (!c) return;

		c.font = `100px ${FONT_FAMILY}`;
		const w = c.measureText('M').width;
		if (w > 0) advanceRatio = w / 100;

		const min = Math.min(cssW, cssH);
		if (min <= 0) {
			rings = [];
			return;
		}

		const rc = window.matchMedia('(max-width: 1023px)').matches
			? Math.min(ringCount, MOBILE_RING_COUNT)
			: ringCount;
		cx = cssW / 2;
		cy = cssH / 2;
		maskR2 = (min * 0.085) ** 2;

		const span = min * 0.5 * coverage - min * 0.0225;
		const gap = span / Math.max(1, rc - 1);
		const fontScale = min / (min * 0.5 * coverage);

		const words = text
			.replace(SEPARATOR_RE, ' ')
			.split(' ')
			.filter((w) => w.length > 0);
		rings = [];
		const r0 = min * 0.0225;
		for (let i = 0; i < rc; i++) {
			const baseR = r0 + i * gap;

			const fontSize = Math.min(min * 0.021, Math.max(6, min * fontScale * (0.0075 + 0.0009 * i)));
			const advance = fontSize * advanceRatio;

			const n = Math.max(12, Math.round((TAU * baseR) / advance));
			const step = TAU / n;
			const cosJ = new Float64Array(n);
			const sinJ = new Float64Array(n);
			for (let j = 0; j < n; j++) {
				cosJ[j] = Math.cos(j * step);
				sinJ[j] = Math.sin(j * step);
			}

			const letters = new Array<string>(n);
			let j = 0;
			while (j < n && words.length > 0) {
				const phraseDots = Math.random() < PHRASE_DOT_P;
				for (const word of words) {
					const asDots = phraseDots || Math.random() > textFraction;
					for (let k = 0; k < word.length && j < n; k++) {
						letters[j++] = asDots ? '' : word[k];
					}
					if (j < n) letters[j++] = '';
				}
			}
			while (j < n) letters[j++] = '';

			const jitters = new Uint8Array(n);
			for (let k = 0; k < n; k++) jitters[k] = Math.random() < JITTER_P ? 1 : 0;

			const { atlas, cellW, cellH, index } = bakeAtlas(letters, fontSize);
			rings.push({
				baseR,
				font: `${fontSize.toFixed(2)}px ${FONT_FAMILY}`,
				fontSize,
				atlas,
				cellW,
				cellH,
				index,
				n,
				cosJ,
				sinJ,
				letters,
				jitters,
				flickerUntil: new Float64Array(n),

				rf: introT >= INTRO_TAIL ? 1 : 0.55,
				chargeFrom: 1,

				chargeRf: (r0 + (baseR - r0) * GAP_COMPRESS) / baseR,
				alpha: introT >= INTRO_TAIL ? 1 : 0,
				rv: 0,
				releaseAt: 0,
				rot: Math.random() * TAU,
				dir: i % 2 === 0 ? 1 : -1,
				speed: 0.024 + i * 0.0009
			});
		}
	}

	function expoInOut(t: number): number {
		if (t <= 0) return 0;
		if (t >= 1) return 1;
		return t < 0.5 ? 0.5 * Math.pow(2, 20 * t - 10) : 1 - Math.pow(2, -20 * t + 10) / 2;
	}

	function step(dt: number, now: number) {
		if (introT < INTRO_TAIL) {
			introT += dt;
			for (let i = 0; i < rings.length; i++) {
				const ring = rings[i];
				const local = introT - i * INTRO_WAVE_STEP;
				if (local < 0) continue;
				ring.alpha = Math.min(1, local / INTRO_FADE);
				if (local > INTRO_FADE) {
					ring.rv += ((1 - ring.rf) * SPRING_K - ring.rv * SPRING_C) * dt;
					ring.rf += ring.rv * dt;
				}
			}
		}
		if (phase === 'charge') {
			chargeT += dt;

			const p = Math.min(1, chargeT / CHARGE_ZOOM_T);
			const e = expoInOut(p);
			for (let i = 0; i < rings.length; i++) {
				const ring = rings[i];
				ring.rf = ring.chargeFrom + (ring.chargeRf - ring.chargeFrom) * e;
				ring.rv = 0;
			}
			jitter = Math.min(1, chargeT / JITTER_RAMP);

			if (!chargeFull && chargeT >= CHARGE_FULL_T) {
				chargeFull = true;
				tooltipLabel = 'RELEASE NOW';
			}
		} else {
			jitter = 0;
			if (phase === 'spring') {
				let settled = true;
				for (let i = 0; i < rings.length; i++) {
					const ring = rings[i];
					if (now < ring.releaseAt) {
						settled = false;
						continue;
					}
					ring.rv += ((1 - ring.rf) * SPRING_K - ring.rv * SPRING_C) * dt;
					ring.rf += ring.rv * dt;
					if (Math.abs(ring.rf - 1) < 0.002 && Math.abs(ring.rv) < 0.02) {
						ring.rf = 1;
						ring.rv = 0;
					} else {
						settled = false;
					}
				}
				if (settled) phase = 'idle';
			} else {
				const k = 1 - Math.exp(-dt * 5);
				for (let i = 0; i < rings.length; i++) {
					rings[i].rf += (1 - rings[i].rf) * k;
				}
			}
		}
	}

	function draw(dt: number, now: number) {
		const c = ctx;
		if (!c || cssW <= 0 || cssH <= 0) return;

		c.setTransform(1, 0, 0, 1, 0, 0);
		c.globalAlpha = 1;
		c.fillStyle = background;
		c.fillRect(0, 0, c.canvas.width, c.canvas.height);

		c.fillStyle = DOT_COLOR;

		let cssSpace = false;
		const shake = jitter * JITTER_PX;
		const spinning = phase !== 'charge';
		for (let i = 0; i < rings.length; i++) {
			const ring = rings[i];
			if (ring.alpha <= 0) continue;
			c.globalAlpha = ring.alpha;
			const r = ring.baseR * ring.rf;
			const cr = Math.cos(ring.rot);
			const sr = Math.sin(ring.rot);
			const { n, cosJ, sinJ, letters, jitters, flickerUntil, atlas, cellW, cellH, index } = ring;

			const pad = ring.fontSize + 2;
			const minX = -pad;
			const maxX = cssW + pad;
			const minY = -pad;
			const maxY = cssH + pad;
			for (let j = 0; j < n; j++) {
				const ca = cr * cosJ[j] - sr * sinJ[j];
				const sa = cr * sinJ[j] + sr * cosJ[j];
				let x = cx + r * ca;
				let y = cy + r * sa;
				if (x < minX || x > maxX || y < minY || y > maxY) continue;
				if (shake > 0 && jitters[j]) {
					x += (Math.random() * 2 - 1) * shake;
					y += (Math.random() * 2 - 1) * shake;
				}
				const glyph = letters[j];
				let showLetter = !!glyph && now >= flickerUntil[j];
				if (showLetter && hovering) {
					const dx = x - mx;
					const dy = y - my;
					if (dx * dx + dy * dy < maskR2) showLetter = false;
				}
				if (showLetter && Math.random() < FLICKER_START_P) {
					flickerUntil[j] = now + FLICKER_MS;
					showLetter = false;
				}
				const cell = showLetter ? index.get(glyph) : undefined;
				if (cell !== undefined) {
					c.setTransform(-sa, ca, -ca, -sa, dpr * x, dpr * y);
					c.drawImage(atlas, cell * cellW, 0, cellW, cellH, -cellW / 2, -cellH / 2, cellW, cellH);
					cssSpace = false;
				} else {
					if (!cssSpace) {
						c.setTransform(dpr, 0, 0, dpr, 0, 0);
						cssSpace = true;
					}
					c.fillRect(x - DOT_SIZE / 2, y - DOT_SIZE / 2, DOT_SIZE, DOT_SIZE);
				}
			}
			if (spinning) ring.rot += ring.dir * ring.speed * dt;
		}
	}

	function frame(nowMs: number) {
		raf = requestAnimationFrame(frame);

		const cap = maxFps > 0 ? maxFps : mobileField ? 30 : 60;
		if (cap > 0) {
			if (nowMs - lastFrame < 1000 / cap) return;
			lastFrame = nowMs;
		}

		const dt = Math.min(0.05, (nowMs - last) / 1000) || 0.016;
		last = nowMs;
		const now = nowMs / 1000;
		step(dt, now);
		draw(dt, now);
	}

	function setVisible(v: boolean) {
		if (visible === v) return;
		visible = v;
		if (v) {
			clearTimeout(freeTimer);

			if (!built) {
				scheduleBuild();
				return;
			}
			last = performance.now();
			lastFrame = 0;
			if (!raf) raf = requestAnimationFrame(frame);
		} else if (raf) {
			cancelAnimationFrame(raf);
			raf = 0;

			clearTimeout(freeTimer);
			freeTimer = setTimeout(() => {
				if (!visible && built) {
					rings = [];
					built = false;
				}
			}, FREE_OFFSCREEN_MS);
		}
	}

	function scheduleBuild() {
		if (built || buildScheduled || destroyed) return;
		buildScheduled = true;
		afterPaint(() =>
			onIdle(() => {
				buildScheduled = false;
				if (destroyed || !ctx || !visible) return;
				built = true;
				buildRings();
				if (!raf) {
					last = performance.now();
					lastFrame = 0;
					raf = requestAnimationFrame(frame);
				}
			})
		);
	}

	function resize() {
		const canvas = canvasEl;
		const container = containerEl;
		if (!canvas || !container) return;
		cssW = container.clientWidth;
		cssH = container.clientHeight;
		if (cssW <= 0 || cssH <= 0) return;
		dpr = Math.min(window.devicePixelRatio || 1, 2);
		canvas.width = Math.round(cssW * dpr);
		canvas.height = Math.round(cssH * dpr);

		if (built) buildRings();
	}

	function setLabelForPhase() {
		if (phase === 'charge') tooltipLabel = chargeFull ? 'RELEASE NOW' : 'KEEP HOLDING';
		else if (phase === 'spring') tooltipLabel = 'RELEASE';
		else tooltipLabel = 'CLICK & HOLD';
	}

	function beginRelease() {
		if (phase !== 'charge') return;
		if (!chargeFull) {
			phase = 'idle';
			tooltipLabel = 'CLICK & HOLD';
			return;
		}
		phase = 'spring';

		const now = performance.now() / 1000;
		for (let i = 0; i < rings.length; i++) {
			rings[i].releaseAt = now + i * WAVE_STEP;
			rings[i].rv = 0;
		}
		tooltipLabel = 'RELEASE';
		clearTimeout(releaseTimer);
		releaseTimer = setTimeout(() => {
			if (phase !== 'charge') tooltipLabel = 'CLICK & HOLD';
		}, RELEASE_LABEL_MS);
	}

	function onPointerEnter() {
		hovering = true;
		tooltipVisible = true;
		setLabelForPhase();
	}

	function onPointerMove(e: PointerEvent) {
		const canvas = canvasEl;
		const tooltip = tooltipEl;
		if (!canvas) return;
		const rect = canvas.getBoundingClientRect();
		mx = e.clientX - rect.left;
		my = e.clientY - rect.top;

		if (tooltip) tooltip.style.transform = `translate3d(${mx + 14}px, ${my + 14}px, 0)`;
	}

	function onPointerLeave() {
		hovering = false;
		tooltipVisible = false;
		beginRelease();
	}

	function onPointerDown(e: PointerEvent) {
		if (e.button !== 0) return;
		clearTimeout(releaseTimer);

		for (let i = 0; i < rings.length; i++) rings[i].chargeFrom = rings[i].rf;
		phase = 'charge';
		chargeT = 0;
		chargeFull = false;
		tooltipLabel = 'KEEP HOLDING';
	}

	function onPointerUp(e: PointerEvent) {
		if (e.button !== 0) return;
		beginRelease();
	}

	$effect(() => {
		void ink;
		void text;
		void ringCount;
		void coverage;
		void textFraction;
		if (ctx && built) buildRings();
	});

	onMount(() => {
		const canvas = canvasEl;
		if (!canvas) return;
		ctx = canvas.getContext('2d', { alpha: false });
		if (!ctx) return;
		mobileField = window.matchMedia('(max-width: 1023px)').matches;

		const ro = new ResizeObserver(resize);
		if (containerEl) ro.observe(containerEl);
		resize();

		const io = new IntersectionObserver(
			(entries) => setVisible(entries.some((e) => e.isIntersecting)),
			{ rootMargin: '200px 0px' }
		);
		if (containerEl) io.observe(containerEl);

		if (document.fonts) {
			document.fonts
				.load(`16px ${FONT_FAMILY.split(',')[0]}`)
				.then(() => (built ? buildRings() : scheduleBuild()))
				.catch(() => {});
		}

		window.addEventListener('pointerup', onPointerUp);
		window.addEventListener('pointercancel', onPointerUp);

		last = performance.now();

		cleanup = () => {
			destroyed = true;
			cancelAnimationFrame(raf);
			raf = 0;
			io.disconnect();
			ro.disconnect();
			clearTimeout(releaseTimer);
			clearTimeout(freeTimer);
			window.removeEventListener('pointerup', onPointerUp);
			window.removeEventListener('pointercancel', onPointerUp);
			ctx = null;
			rings = [];
		};
	});

	onDestroy(() => cleanup?.());
</script>

<div
	bind:this={containerEl}
	class="relative h-full w-full cursor-pointer touch-none overflow-hidden bg-black select-none {className}"
	onpointerenter={onPointerEnter}
	onpointermove={onPointerMove}
	onpointerleave={onPointerLeave}
	onpointerdown={onPointerDown}
	role="presentation"
>
	<canvas bind:this={canvasEl} class="absolute inset-0 block h-full w-full"></canvas>
	{#if tooltipVisible}
		<div
			bind:this={tooltipEl}
			class="pointer-events-none absolute top-0 left-0 z-10 border border-white/40 bg-[#141414] px-2 py-1 font-mono text-[10px] tracking-[0.15em] whitespace-nowrap text-white/90 uppercase"
			style="transform: translate3d(0, 0, 0)"
		>
			{tooltipLabel}
		</div>
	{/if}
</div>
