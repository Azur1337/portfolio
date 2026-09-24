<script lang="ts">
	import { resolve } from '$app/paths';
	import Reveal from '$lib/components/Reveal.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Blog · Azur</title>
	<meta name="description" content="Engineering log and technical notes by Azur." />
</svelte:head>

<header class="mb-56 flex flex-col gap-24 lg:mb-72">
	<Reveal>
		<p class="font-mono text-caption-20 font-medium text-dark-grey uppercase">Engineering log</p>
	</Reveal>
	<Reveal>
		<h1 class="font-mono text-headline-10 font-medium">Blog</h1>
	</Reveal>
	<Reveal>
		<p class="max-w-[56ch] text-body-20 text-dark-grey">
			Notes on systems, security and web engineering: build logs, teardowns, and things worth
			writing down.
		</p>
	</Reveal>
</header>

{#if data.posts.length === 0}
	<div class="font-mono text-caption-20 text-dark-grey">
		<p><span class="text-accent">$</span> ls ./posts</p>
		<p class="mt-12">no posts yet, check back soon.</p>
	</div>
{:else}
	<ul class="flex flex-col gap-16">
		{#each data.posts as post (post.meta.slug)}
			<li>
				<a
					href={resolve(`/blog/${post.meta.slug}`)}
					class="group block rounded-8 border border-mid-grey p-24 transition-colors hover:border-accent lg:p-32"
				>
					<div
						class="flex flex-wrap items-baseline gap-x-16 gap-y-8 font-mono text-caption-10 uppercase"
					>
						<span class="text-accent tabular-nums">{post.meta.date}</span>
						{#each post.meta.tags as tag (tag)}
							<span class="text-dark-grey">#{tag}</span>
						{/each}
						<span class="ml-auto text-dark-grey tabular-nums">{post.meta.readingTime} min read</span
						>
					</div>

					<div class="mt-16 flex items-start gap-12">
						<span
							aria-hidden="true"
							class="mt-2 font-mono text-body-20 text-accent transition-transform group-hover:translate-x-4"
							>&gt;</span
						>
						<div class="min-w-0">
							<h2 class="font-mono text-body-30 leading-tight font-medium">
								{post.meta.title}
							</h2>
							{#if post.meta.description}
								<p class="mt-8 max-w-[72ch] text-body-10 text-dark-grey">
									{post.meta.description}
								</p>
							{/if}
						</div>
					</div>
				</a>
			</li>
		{/each}
	</ul>
{/if}
