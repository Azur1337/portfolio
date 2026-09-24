<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { lenisInstance, scrollEase } from '$lib/stores/lenis';
	import { loadAnimationEngine } from '$lib/stores/animation-engine';

	let { children }: { children: Snippet } = $props();

	onMount(() => {
		let disposed = false;
		let cleanup: (() => void) | undefined;

		loadAnimationEngine().then(({ gsap, ScrollTrigger, Lenis }) => {
			if (disposed) return;
			const lenis = new Lenis({
				wrapper: window,

				allowNestedScroll: true,

				anchors: { duration: 1.2, easing: scrollEase, offset: 0 }
			});

			lenisInstance.current = lenis;

			lenis.on('scroll', ScrollTrigger.update);

			const tick = (time: number) => lenis.raf(time * 1000);
			gsap.ticker.add(tick);
			gsap.ticker.lagSmoothing(0);

			cleanup = () => {
				gsap.ticker.remove(tick);
				lenis.destroy();
				lenisInstance.current = undefined;
			};
		});

		return () => {
			disposed = true;
			cleanup?.();
		};
	});
</script>

{@render children()}
