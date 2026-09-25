<script lang="ts">
	import { onMount } from 'svelte';
	import type { Project } from '$lib/data/projects';

	let {
		project,
		ascii,
		image,
		imageAvif,
		index
	}: {
		project: Project;
		ascii: string;
		image: string;

		imageAvif?: string;
		index: number;
	} = $props();

	const num = $derived(String(index + 1).padStart(3, '0'));
	const link = $derived(project.link);

	let cardEl: HTMLElement | undefined;

	let mobileRevealed = $state(false);

	onMount(() => {
		const mq = window.matchMedia('(max-width: 63.9375rem)');
		let io: IntersectionObserver | undefined;
		const setup = () => {
			io?.disconnect();
			io = undefined;
			if (!mq.matches || !cardEl) {
				mobileRevealed = false;
				return;
			}
			io = new IntersectionObserver(([entry]) => (mobileRevealed = entry.isIntersecting), {
				rootMargin: '-50% 0px -50% 0px',
				threshold: 0
			});
			io.observe(cardEl);
		};
		setup();
		mq.addEventListener('change', setup);
		return () => {
			io?.disconnect();
			mq.removeEventListener('change', setup);
		};
	});
</script>

<svelte:element
	this={link ? 'a' : 'div'}
	{...link ? { href: link, target: '_blank', rel: 'noopener noreferrer' } : {}}
	bind:this={cardEl}
	class="group flex flex-col gap-16"
>
	<div class="@container relative aspect-video overflow-hidden">
		<pre
			role="img"
			aria-label="{project.title}, rendered as ASCII art"
			class="project-art m-0 w-full overflow-hidden leading-none whitespace-pre text-ghost-grey transition-opacity duration-500 group-hover:opacity-0 {mobileRevealed
				? 'opacity-0'
				: ''}"
			style="font-size: calc(100cqw / 96)">{ascii}</pre>

		<picture class="absolute inset-0">
			{#if imageAvif}
				<source type="image/avif" srcset={imageAvif} />
			{/if}
			<img
				src={image}
				alt="{project.title} screenshot"
				width={1920}
				height={1080}
				loading="lazy"
				decoding="async"
				fetchpriority="low"
				class="size-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 {mobileRevealed
					? 'opacity-100'
					: ''}"
			/>
		</picture>
	</div>

	<div class="flex flex-col gap-6">
		<div class="flex items-baseline justify-between gap-12">
			<h3 class="font-mono text-caption-20 text-accent uppercase">{project.title}</h3>
			<span class="font-mono text-caption-10 text-dark-grey">{num}</span>
		</div>

		{#if project.award}
			<span
				class="w-fit rounded-full border border-accent/40 px-10 py-2 font-mono text-caption-10 text-accent uppercase"
			>
				{project.award}
			</span>
		{/if}

		{#if project.press && project.press.length}
			<div class="flex flex-wrap items-center gap-x-12 gap-y-4 font-mono text-caption-10 uppercase">
				<span class="text-dark-grey">As seen in</span>

				{#each project.press as item (item.href)}
					<a
						href={item.href}
						target="_blank"
						rel="noopener noreferrer"
						class="text-ghost-grey underline decoration-dashed decoration-from-font underline-offset-4 transition-colors hover:text-accent"
					>
						{item.label}
					</a>
				{/each}
			</div>
		{/if}

		<p class="text-body-10 text-ghost-grey">{project.summary}</p>

		<ul class="flex flex-wrap gap-x-12 gap-y-4 font-mono text-caption-10 text-dark-grey uppercase">
			{#each project.tags as tag (tag)}
				<li>{tag}</li>
			{/each}
		</ul>
	</div>
</svelte:element>

<style>
	.project-art {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		line-height: 1;
		user-select: none;
	}
</style>
