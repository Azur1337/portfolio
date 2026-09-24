<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import type { AsciiRenderer, AsciiRendererOptions } from 'azur-ascii-renderer';

	type HandModule = typeof import('azur-ascii-renderer/hand');

	const HAND_PHRASE = 'WEB · SYSTEMS · DESIGN · ENGINEERING · PERFORMANCE · ';

	interface Props {
		phrase?: string;

		dark?: boolean;

		ink?: string;

		background?: string;

		interactive?: boolean;

		hand?: boolean;

		regionWidthFraction?: number;

		regionHeightFraction?: number;

		regionXFraction?: number;

		regionYFraction?: number;

		flicker?: boolean;

		viewportCell?: boolean;

		cellScale?: number;

		scatter?: number;

		maxFps?: number;

		dpr?: number;

		class?: string;

		children?: Snippet;
	}

	let {
		phrase,
		dark = true,
		ink,
		background = '#000',
		interactive = true,
		hand: withHand = false,
		regionWidthFraction,
		regionHeightFraction,
		regionXFraction,
		regionYFraction,
		flicker = true,
		viewportCell = false,
		cellScale = 1,
		scatter = 0,
		maxFps = 0,
		dpr,
		class: className = '',
		children
	}: Props = $props();

	const staticField = $derived(!flicker && !interactive);

	let canvasEl: HTMLCanvasElement | undefined;
	let renderer: AsciiRenderer | undefined;
	let targetRows = 0;
	let rafId = 0;
	let start = 0;
	let running = false;
	let lastFrame = 0;
	let renderTimer: ReturnType<typeof setTimeout> | undefined;

	function frame(now: number) {
		if (!running) return;
		rafId = requestAnimationFrame(frame);

		if (maxFps > 0) {
			const minInterval = 1000 / maxFps;
			if (now - lastFrame < minInterval) return;
			lastFrame = now;
		}
		renderer?.render(now - start);
	}

	function startLoop() {
		if (running || !renderer || staticField) return;
		running = true;
		lastFrame = 0;
		rafId = requestAnimationFrame(frame);
	}

	function stopLoop() {
		if (!running) return;
		running = false;
		cancelAnimationFrame(rafId);
	}

	function renderOnce() {
		if (renderer) renderer.render(performance.now() - start);
	}

	function resize() {
		if (!canvasEl || !renderer) return;

		renderer.setViewportHeight(window.innerHeight);

		if (viewportCell) renderer.setCellHeight((window.innerHeight / targetRows) * cellScale);
		renderer.resize(canvasEl.clientWidth, canvasEl.clientHeight, dpr ?? window.devicePixelRatio);
		if (staticField) {
			clearTimeout(renderTimer);
			renderTimer = setTimeout(renderOnce, 100);
		}
	}

	function onPointerMove(e: PointerEvent) {
		if (!renderer || !canvasEl || !interactive) return;
		const rect = canvasEl.getBoundingClientRect();
		renderer.pointer(e.clientX - rect.left, e.clientY - rect.top);
	}

	function onPointerLeave() {
		if (!renderer || !interactive) return;
		renderer.pointerClear();
	}

	function onPointerDown(e: PointerEvent) {
		if (!renderer || !canvasEl || !interactive) return;
		const rect = canvasEl.getBoundingClientRect();
		renderer.click(e.clientX - rect.left, e.clientY - rect.top);
	}

	$effect(() => {
		renderer?.setRegion({
			width: regionWidthFraction,
			height: regionHeightFraction,
			x: regionXFraction,
			y: regionYFraction
		});
	});

	onMount(() => {
		const canvas = canvasEl;
		if (!canvas) return;

		let introDone = !withHand;
		let introVisible = false;
		let introTimer: ReturnType<typeof setTimeout> | undefined;
		function fireIntro() {
			if (introDone || !renderer) return;
			introDone = true;
			if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

			introTimer = setTimeout(() => {
				if (!canvasEl) return;
				renderer?.click(canvasEl.clientWidth / 2, canvasEl.clientHeight / 2);
			}, 350);
		}

		const buildOptions = (handBmp?: HandModule['hand']): AsciiRendererOptions => {
			const flickerOpts = flicker ? {} : { flickerCount: 0 };
			return withHand
				? {
						dark,
						ink,
						background,
						scatter,
						...flickerOpts,
						...handBmp,
						phrase: HAND_PHRASE,
						regionWidthFraction,
						regionHeightFraction,
						regionXFraction,
						regionYFraction
					}
				: {
						dark,
						ink,
						background,
						scatter,
						...flickerOpts,
						phrase: phrase ?? 'AZUR · '
					};
		};

		const ro = new ResizeObserver(resize);
		ro.observe(canvas);

		let created = false;
		let destroyed = false;

		const boot = async () => {
			if (created) return;
			created = true;
			const [mod, handMod] = await Promise.all([
				import('azur-ascii-renderer'),
				withHand ? import('azur-ascii-renderer/hand') : Promise.resolve(undefined)
			]);
			if (destroyed || !canvasEl) return;
			targetRows = mod.TARGET_ROWS;
			const r = mod.createAsciiRenderer(canvas, buildOptions(handMod?.hand));
			renderer = r;
			start = performance.now();
			resize();
			if (!staticField) startLoop();
			if (introVisible) fireIntro();
		};

		const io = new IntersectionObserver(
			(entries) => {
				if (!entries.some((e) => e.isIntersecting)) {
					stopLoop();
					return;
				}
				if (!created) {
					if (document.fonts) {
						document.fonts.load('16px GeistMono').then(boot).catch(boot);
					} else {
						boot();
					}
				} else if (!staticField) {
					startLoop();
				}
			},
			{ rootMargin: '500px 0px' }
		);
		io.observe(canvas);

		let vio: IntersectionObserver | undefined;
		if (withHand) {
			vio = new IntersectionObserver(
				(entries) => {
					if (!entries.some((e) => e.isIntersecting)) return;
					introVisible = true;
					if (created) fireIntro();
					vio?.disconnect();
				},
				{ threshold: 0.25 }
			);
			vio.observe(canvas);
		}

		const onWindowResize = () => resize();
		if (viewportCell) window.addEventListener('resize', onWindowResize);

		return () => {
			destroyed = true;
			io.disconnect();
			vio?.disconnect();
			ro.disconnect();
			stopLoop();
			clearTimeout(renderTimer);
			clearTimeout(introTimer);
			if (viewportCell) window.removeEventListener('resize', onWindowResize);
			renderer?.destroy();
			renderer = undefined;
		};
	});
</script>

<div
	role="presentation"
	class="relative h-full w-full {className}"
	onpointermove={onPointerMove}
	onpointerleave={onPointerLeave}
	onpointerdown={onPointerDown}
>
	<canvas bind:this={canvasEl} class="absolute inset-0 -z-10 h-full w-full"></canvas>
	{#if children}{@render children()}{/if}
</div>
