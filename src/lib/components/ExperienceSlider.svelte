<script lang="ts">
	import { onMount } from 'svelte';
	import { experience } from '$lib/data/experience';
	import Reveal from '$lib/components/Reveal.svelte';

	let track: HTMLElement | undefined;
	let index = $state(0);
	let perView = $state(1);

	const total = experience.length;
	const pad = (n: number) => String(n).padStart(2, '0');
	const maxIndex = $derived(Math.max(0, total - perView));
	const atStart = $derived(index <= 0);
	const atEnd = $derived(index >= maxIndex);

	function initials(name: string): string {
		const words = name
			.replace(/(gmbh|spa|inc|ltd|llc)\b/gi, '')
			.trim()
			.split(/\s+/)
			.filter(Boolean);
		const letters = words.slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '');
		return letters.join('') || '?';
	}

	function cards(): HTMLElement[] {
		return track ? (Array.from(track.querySelectorAll('article')) as HTMLElement[]) : [];
	}

	function step(): number {
		const list = cards();
		if (list.length < 2 || !track) return track?.clientWidth ?? 0;
		return list[1].offsetLeft - list[0].offsetLeft;
	}

	function measurePerView(): number {
		const list = cards();
		const first = list[0];
		if (!first || !track) return 1;
		const cs = getComputedStyle(track);
		const gap = parseFloat(cs.columnGap) || 0;
		const inner =
			track.clientWidth - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0);
		const slot = first.offsetWidth + gap;
		return slot > 0 ? Math.max(1, Math.round(inner / slot)) : 1;
	}

	function scrollToIndex(i: number, smooth = true) {
		if (!track) return;
		track.scrollTo({ left: i * step(), behavior: smooth ? 'smooth' : 'auto' });
	}

	function go(delta: number) {
		const next = Math.min(maxIndex, Math.max(0, index + delta));
		if (next === index) return;
		index = next;
		scrollToIndex(index);
	}

	let scrollRaf = 0;
	function onScroll() {
		cancelAnimationFrame(scrollRaf);
		scrollRaf = requestAnimationFrame(() => {
			if (!track) return;
			const s = step();
			const n = s ? Math.round(track.scrollLeft / s) : 0;
			const clamped = Math.min(maxIndex, Math.max(0, n));
			if (clamped !== index) index = clamped;
		});
	}

	onMount(() => {
		const measure = () => {
			perView = measurePerView();
			index = Math.min(index, maxIndex);
			scrollToIndex(index, false);
		};
		measure();
		window.addEventListener('resize', measure);
		return () => {
			window.removeEventListener('resize', measure);
			cancelAnimationFrame(scrollRaf);
		};
	});
</script>

{#snippet sep()}
	<span aria-hidden="true" class="mx-10 text-white/25">·</span>
{/snippet}

<div class="mx-auto w-full max-w-1920 px-16 lg:px-80">
	<div class="mb-48 flex flex-col gap-16">
		<Reveal>
			<p class="font-mono text-caption-20 font-medium text-dark-grey uppercase">./experience</p>
		</Reveal>
		<Reveal>
			<h2 class="text-headline-10 font-medium">
				Where I've<span class="text-accent">.</span> worked
			</h2>
		</Reveal>
	</div>

	<div
		class="track -mx-16 flex gap-x-16 overflow-x-auto px-16 lg:-mx-80 lg:px-80"
		bind:this={track}
		onscroll={onScroll}
	>
		{#each experience as e, i (i)}
			<article
				class="card group rounded-6 flex min-h-420 flex-col justify-between bg-black p-32 ring-1 transition-shadow duration-500 lg:p-48 {i ===
				index
					? 'ring-white/25'
					: 'ring-white/10'}"
			>
				<div class="flex flex-col gap-28">
					<div class="flex items-baseline justify-between gap-16">
						<p class="font-mono text-caption-20 text-accent uppercase">
							{e.period}{#if e.duration}
								{@render sep()}<span class="text-dark-grey">{e.duration}</span>
							{/if}
						</p>
						<span class="font-mono text-caption-10 text-dark-grey">{i + 1}</span>
					</div>

					<div class="flex flex-col gap-10">
						<h3 class="text-headline-10 font-medium text-balance">{e.role}</h3>
						<p class="text-body-20 text-ghost-grey">
							{#if e.website}
								<a
									{...{ href: e.website, target: '_blank', rel: 'noopener noreferrer' }}
									class="transition-colors hover:text-accent">{e.company}</a
								>
							{:else}
								{e.company}
							{/if}
							{#if e.employmentType}
								{@render sep()}<span class="text-dark-grey">{e.employmentType}</span>
							{/if}
						</p>
						{#if e.location || e.workMode}
							<p class="font-mono text-caption-10 text-dark-grey uppercase">
								{#each [e.location, e.workMode].filter(Boolean) as part, pi (pi)}
									{#if pi}{@render sep()}{/if}{part}
								{/each}
							</p>
						{/if}
					</div>

					{#if e.highlights.length}
						<ul class="flex flex-col gap-12">
							{#each e.highlights as h (h)}
								<li class="flex gap-12 text-body-10 text-ghost-grey">
									<span aria-hidden="true" class="shrink-0 text-accent">-</span>
									<span class="max-w-[52ch]">{h}</span>
								</li>
							{/each}
						</ul>
					{/if}

					<ul class="flex flex-wrap gap-x-12 gap-y-6 font-mono text-caption-10 uppercase">
						{#each e.skills as s (s)}
							<li class="text-dark-grey">{s}</li>
						{/each}
					</ul>
				</div>

				<div class="mt-40 flex items-center gap-16 border-t border-white/10 pt-24">
					<span class="size-52 shrink-0 overflow-hidden rounded-full ring-1 ring-white/15">
						{#if e.logo}
							<img src={e.logo} alt="{e.company} logo" class="size-full object-cover" />
						{:else}
							<span
								aria-hidden="true"
								class="grid size-full place-items-center font-mono text-caption-20 text-accent"
							>
								{initials(e.company)}
							</span>
						{/if}
					</span>
					<div class="flex min-w-0 flex-col gap-2">
						{#if e.website}
							<a
								{...{ href: e.website, target: '_blank', rel: 'noopener noreferrer' }}
								class="truncate font-mono text-caption-20 uppercase underline decoration-dashed decoration-from-font underline-offset-4 transition-colors hover:text-accent"
							>
								{e.company}
							</a>
						{:else}
							<span class="truncate font-mono text-caption-20 uppercase">{e.company}</span>
						{/if}
						<span class="truncate font-mono text-caption-10 text-dark-grey uppercase">
							{e.role}{#if e.employmentType}
								{@render sep()}<span>{e.employmentType}</span>
							{/if}
						</span>
					</div>
				</div>
			</article>
		{/each}
	</div>

	<div class="mt-48 flex items-center justify-center gap-24 font-mono text-caption-20">
		<button
			type="button"
			onclick={() => go(-1)}
			disabled={atStart}
			aria-label="Previous role"
			class="text-dark-grey transition-colors hover:text-accent focus-visible:text-accent disabled:cursor-not-allowed disabled:text-white/15 disabled:hover:text-white/15"
		>
			[&lt;]
		</button>
		<span class="text-white tabular-nums" aria-live="polite">{pad(index + 1)} / {pad(total)}</span>
		<button
			type="button"
			onclick={() => go(1)}
			disabled={atEnd}
			aria-label="Next role"
			class="text-dark-grey transition-colors hover:text-accent focus-visible:text-accent disabled:cursor-not-allowed disabled:text-white/15 disabled:hover:text-white/15"
		>
			[&gt;]
		</button>
	</div>
</div>

<style>
	.track {
		scrollbar-width: none;
		-ms-overflow-style: none;
	}
	.track::-webkit-scrollbar {
		display: none;
	}

	.card {
		flex: 0 0 100%;
	}
	@media (min-width: 64rem) {
		.card {
			flex-basis: calc(50% - 0.5rem);
		}
	}
</style>
