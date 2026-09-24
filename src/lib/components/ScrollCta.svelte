<script lang="ts">
	import { lenisInstance, scrollEase } from '$lib/stores/lenis';

	function scrollToIntro() {
		const target = document.getElementById('intro');
		if (!target) return;
		const lenis = lenisInstance.current;
		if (lenis) lenis.scrollTo(target, { easing: scrollEase, duration: 1.2 });
		else target.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<button
	type="button"
	aria-label="Scroll to the next section"
	class="group absolute bottom-40 left-1/2 z-10 hidden -translate-x-1/2 cursor-pointer flex-col items-center rounded-4 bg-black-deep px-8 py-10 ring-1 ring-white/20 transition-shadow ring-inset hover:ring-white/40 focus-visible:ring-2 focus-visible:ring-white/60 lg:flex"
	onclick={scrollToIntro}
>
	<span
		aria-hidden="true"
		class="relative block h-48 w-6 overflow-hidden"
		style="background-image: repeating-linear-gradient(to bottom, rgba(255,255,255,0.12) 0 1px, transparent 1px 8px)"
	>
		<span
			class="absolute inset-x-0 top-0 h-6 animate-hero-scroll-cue bg-white/90 transition-colors group-hover:bg-white motion-reduce:hidden"
		></span>
		<span class="absolute inset-x-0 bottom-0 hidden h-6 bg-white/90 motion-reduce:block"></span>
	</span>
</button>
