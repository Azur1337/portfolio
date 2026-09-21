<script lang="ts">
	import { onMount, unmount, mount, type Component } from 'svelte';
	import { getAnimationEngine } from '$lib/stores/animation-engine';
	import { afterPaint } from '$lib/utils/idle';

	interface Props {
		load: () => Promise<{ default: Component }>;

		rootMargin?: string;

		minHeight?: string;
		class?: string;
	}

	let {
		load,
		rootMargin = '600px 0px',
		minHeight = '0px',
		class: className = ''
	}: Props = $props();

	let hostEl: HTMLDivElement | undefined;

	onMount(() => {
		let disposed = false;
		let instance: ReturnType<typeof mount> | undefined;

		const io = new IntersectionObserver(
			(entries) => {
				if (!entries.some((e) => e.isIntersecting)) return;
				io.disconnect();

				afterPaint(() => {
					load().then((mod) => {
						if (disposed || !hostEl) return;
						instance = mount(mod.default, { target: hostEl });
						requestAnimationFrame(() => getAnimationEngine()?.ScrollTrigger.refresh());
					});
				});
			},
			{ rootMargin }
		);
		if (hostEl) io.observe(hostEl);

		return () => {
			disposed = true;
			io.disconnect();
			if (instance) unmount(instance);
		};
	});
</script>

<div bind:this={hostEl} class={className} style:min-height={minHeight}></div>
