<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	const backHref = $derived(page.route.id === '/blog' ? resolve('/') : resolve('/blog'));
</script>

<div class="min-h-svh bg-off-white text-black">
	<div
		class="mx-auto flex min-h-svh w-full max-w-[1040px] flex-col px-16 pt-140 pb-40 lg:px-40 lg:pt-140 lg:pb-64"
	>
		<div class="flex items-center justify-between gap-16 border-b border-mid-grey pb-20">
			<a
				href={backHref}
				class="font-mono text-caption-10 text-dark-grey uppercase transition-colors hover:text-black"
				>← Back</a
			>
			<span class="font-mono text-caption-10 text-dark-grey" aria-hidden="true"
				>azur@portfolio:~/blog$</span
			>
		</div>

		<main class="flex-1 py-56 lg:py-80">
			{@render children()}
		</main>

		<div class="border-t border-mid-grey pt-20">
			<p class="font-mono text-caption-10 text-dark-grey uppercase">© 2026 Azur</p>
		</div>
	</div>
</div>
