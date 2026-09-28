<script lang="ts">
	import { onMount } from 'svelte';
	import { splitText, type SplitLevel, type TextSplit } from 'azur-text-splitter';
	import { loadAnimationEngine } from '$lib/stores/animation-engine';
	import { onIdle } from '$lib/utils/idle';
	import type { Snippet } from 'svelte';

	type Gsap = typeof import('gsap').default;

	interface Props {
		class?: string;

		type?: SplitLevel[];

		mask?: boolean;

		stagger?: number;

		duration?: number;

		start?: string;
		children?: Snippet;
	}

	let {
		class: className = '',
		type = ['lines'],
		mask = true,
		stagger = 0.08,
		duration = 0.9,
		start = 'top 85%',
		children
	}: Props = $props();

	let el: HTMLDivElement | undefined;
	let split: TextSplit | undefined;
	let revealed = false;
	let gsap: Gsap | undefined;
	let resizeTimer: ReturnType<typeof setTimeout> | undefined;
	let contentTimer: ReturnType<typeof setTimeout> | undefined;
	let selfMutation = false;

	let levels: SplitLevel[] | undefined;
	function effectiveLevels(): SplitLevel[] {
		return levels ?? type;
	}

	const reduced =
		typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	function doSplit() {
		if (!el || !gsap) return;
		const g = gsap;

		selfMutation = true;
		try {
			g.killTweensOf(split?.lines ?? []);
			split?.revert();
			split = splitText(el, { type: effectiveLevels(), mask: mask ? 'lines' : undefined });

			for (let attempt = 0; attempt < 3; attempt++) {
				const over = split.lines.some(
					(l) => l.scrollWidth > l.clientWidth + 1 || l.scrollHeight > l.clientHeight + 1
				);
				if (!over) break;
				split.revert();
				split = splitText(el, { type: effectiveLevels(), mask: mask ? 'lines' : undefined });
			}

			el.style.setProperty('--lines', String(split.lines.length));
			el.style.setProperty('--words', String(split.words.length));
			el.style.setProperty('--chars', String(split.chars.length));

			const padPx =
				mask && split.masks.length
					? parseFloat(getComputedStyle(split.lines[0]).fontSize) * 0.2
					: 0;
			for (const m of split.masks) {
				m.style.paddingBlock = '0.2em';
				m.style.marginBlock = '-0.2em';
			}

			if (reduced || revealed) {
				g.set(split.lines, { yPercent: 0, y: 0 });
				return;
			}

			const rect = el.getBoundingClientRect();
			if (rect.top < window.innerHeight * 0.85 && rect.bottom > 0) {
				revealed = true;
				g.set(split.lines, { yPercent: 0, y: 0 });
				return;
			}
			g.set(split.lines, { yPercent: 100, y: padPx });
			g.to(split.lines, {
				yPercent: 0,
				y: 0,
				duration,
				ease: 'power3.out',
				stagger,
				scrollTrigger: {
					trigger: el,
					start,
					toggleActions: 'play none none reverse'
				}
			});
		} finally {
			requestAnimationFrame(() => (selfMutation = false));
		}
	}

	onMount(() => {
		let disposed = false;
		if (window.matchMedia('(max-width: 1023px)').matches) levels = ['lines'];

		function start() {
			Promise.all([loadAnimationEngine(), document.fonts?.ready ?? Promise.resolve()]).then(
				([engine]) => {
					if (disposed) return;
					gsap = engine.gsap;

					onIdle(() => {
						if (!disposed) doSplit();
					});
				}
			);
		}

		const io = new IntersectionObserver(
			(entries) => {
				if (!entries.some((e) => e.isIntersecting)) return;
				io.disconnect();
				start();
			},
			{ rootMargin: '300px 0px' }
		);
		if (el) io.observe(el);

		const contentObserver = new MutationObserver(() => {
			if (selfMutation) return;
			clearTimeout(contentTimer);
			contentTimer = setTimeout(() => {
				const rect = el?.getBoundingClientRect();
				if (rect && rect.top < window.innerHeight * 0.85 && rect.bottom > 0) revealed = true;
				doSplit();
			}, 100);
		});
		if (el) contentObserver.observe(el, { childList: true, subtree: true, characterData: true });

		const onResize = () => {
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(() => {
				const rect = el?.getBoundingClientRect();
				if (rect && rect.top < window.innerHeight * 0.85 && rect.bottom > 0) revealed = true;
				doSplit();
			}, 300);
		};
		window.addEventListener('resize', onResize);

		return () => {
			disposed = true;
			io.disconnect();
			window.removeEventListener('resize', onResize);
			clearTimeout(resizeTimer);
			contentObserver.disconnect();
			clearTimeout(contentTimer);
			gsap?.killTweensOf(split?.lines ?? []);
			split?.revert();
		};
	});
</script>

<div class={className} bind:this={el}>
	{#if children}{@render children()}{/if}
</div>
