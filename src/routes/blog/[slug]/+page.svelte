<script lang="ts">
	import { resolve } from '$app/paths';
	import { copyCodeAction } from '$lib/utils/copy-code';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const Component = $derived(data.post.component);
</script>

<svelte:head>
	<title>{data.post.meta.title} · Blog · Azur</title>
	<meta name="description" content={data.post.meta.description} />
	<meta property="og:title" content={data.post.meta.title} />
	<meta property="og:description" content={data.post.meta.description} />
	<meta property="og:type" content="article" />
</svelte:head>

<article>
	<header class="mb-48 border-b border-mid-grey pb-32">
		<h1 class="font-mono text-headline-10 font-medium">{data.post.meta.title}</h1>
		<div
			class="mt-24 flex flex-wrap items-baseline gap-x-20 gap-y-8 font-mono text-caption-10 uppercase"
		>
			<span class="text-accent tabular-nums">{data.post.meta.date}</span>
			{#each data.post.meta.tags as tag (tag)}
				<span class="text-dark-grey">#{tag}</span>
			{/each}
			<span class="text-dark-grey tabular-nums">{data.post.meta.readingTime} min read</span>
		</div>
	</header>

	<div class="prose-log" use:copyCodeAction>
		{#if Component}<Component />{/if}
	</div>

	<footer class="mt-64 border-t border-mid-grey pt-24">
		<a
			href={resolve('/blog')}
			class="font-mono text-caption-20 text-accent transition-colors hover:text-black"
			>← Back to blog</a
		>
	</footer>
</article>

<style>
	:global {
		.prose-log {
			color: var(--color-black);
			font-size: 1.0625rem;
			line-height: 1.75;
		}

		.prose-log p {
			margin: 0 0 1.25rem;
			max-width: 72ch;
		}

		.prose-log h1,
		.prose-log h2,
		.prose-log h3,
		.prose-log h4 {
			font-family: var(--font-mono);
			color: var(--color-black);
			line-height: 1.2;
			margin: 2.5rem 0 1rem;
			letter-spacing: -0.01em;
		}
		.prose-log h1 {
			font-size: 1.75rem;
		}
		.prose-log h2 {
			font-size: 1.375rem;
			padding-bottom: 0.4rem;
			border-bottom: 1px solid var(--color-mid-grey);
		}
		.prose-log h3 {
			font-size: 1.15rem;
		}
		.prose-log h4 {
			font-size: 1rem;
		}

		.prose-log :not(pre) > code {
			font-family: var(--font-mono);
			font-size: 0.9em;
			background-color: var(--color-ghost-grey);
			color: var(--color-black);
			padding: 0.1em 0.4em;
			border-radius: var(--radius-4);
		}

		.prose-log pre {
			position: relative;
			border: 1px solid var(--color-black-deep);
			border-radius: var(--radius-8);
			padding: 1.25rem 1.1rem;
			overflow-x: auto;
			margin: 1.5rem 0;
			font-size: 0.875rem;
			line-height: 1.6;
		}
		.prose-log pre code {
			font-family: var(--font-mono);
			background: transparent;
			padding: 0;
		}

		.prose-log ul,
		.prose-log ol {
			margin: 0 0 1.25rem;
			padding-left: 1.5rem;
		}
		.prose-log ul {
			list-style: none;
			padding-left: 0;
		}
		.prose-log ul > li {
			position: relative;
			padding-left: 1.5rem;
			margin: 0.4rem 0;
		}
		.prose-log ul > li::before {
			content: '>';
			position: absolute;
			left: 0;
			color: var(--color-accent);
			font-family: var(--font-mono);
		}
		.prose-log ol > li {
			margin: 0.4rem 0;
		}
		.prose-log li > p {
			margin: 0;
		}

		.prose-log a {
			color: var(--color-accent);
			text-decoration: underline;
			text-underline-offset: 3px;
			transition: color 0.2s ease;
		}
		.prose-log a:hover {
			color: var(--color-black);
		}

		.prose-log blockquote {
			border-left: 3px solid var(--color-accent);
			padding: 0.25rem 0 0.25rem 1.25rem;
			margin: 1.5rem 0;
			color: var(--color-dark-grey);
		}
		.prose-log blockquote p {
			margin: 0;
		}

		.prose-log hr {
			border: 0;
			border-top: 1px solid var(--color-mid-grey);
			margin: 2.5rem 0;
		}

		.prose-log img {
			display: block;
			width: 100%;
			height: auto;
			border: 1px solid var(--color-mid-grey);
			border-radius: var(--radius-8);
			margin: 1.75rem 0 0.5rem;
		}

		.prose-log img + p {
			margin-top: 0.5rem;
			color: var(--color-dark-grey);
		}

		.prose-log table {
			width: 100%;
			border-collapse: collapse;
			margin: 1.5rem 0;
			font-size: 0.95em;
		}
		.prose-log th,
		.prose-log td {
			border: 1px solid var(--color-mid-grey);
			padding: 0.5rem 0.75rem;
			text-align: left;
		}
		.prose-log th {
			background-color: var(--color-ghost-grey);
			font-family: var(--font-mono);
		}
	}
</style>
