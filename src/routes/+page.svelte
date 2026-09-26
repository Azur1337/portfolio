<script lang="ts">
	import { onMount } from 'svelte';
	import GlyphField from '$lib/components/canvas/GlyphField.svelte';
	import TextRings from '$lib/components/canvas/TextRings.svelte';
	import Reveal from '$lib/components/Reveal.svelte';
	import ScrollCta from '$lib/components/ScrollCta.svelte';
	import StatusContact from '$lib/components/StatusContact.svelte';
	import Faq from '$lib/components/Faq.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { howIThink } from '$lib/data/principles';
	import { hero } from '$lib/data/hero';
	import { whoami } from '$lib/data/whoami';
	import { code } from '$lib/data/code';
	import LazyMount from '$lib/components/LazyMount.svelte';
	import footerArt1 from '$lib/assets/footer-part1.txt?raw';
	import footerArt2 from '$lib/assets/footer-part2.txt?raw';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import { projects, work } from '$lib/data/projects';
	import ExperienceSlider from '$lib/components/ExperienceSlider.svelte';
	import CvModal from '$lib/components/CvModal.svelte';

	const asciiGlob = import.meta.glob('../lib/assets/projects/*-ascii.txt', {
		eager: true,
		query: '?raw',
		import: 'default'
	}) as Record<string, string>;
	const imageGlob = import.meta.glob('../lib/assets/projects/*.png', {
		eager: true,
		import: 'default'
	}) as Record<string, string>;

	const imageAvifGlob = import.meta.glob('../lib/assets/projects/*.avif', {
		eager: true,
		import: 'default'
	}) as Record<string, string>;
	const items = projects.map((project) => ({
		project,
		ascii: asciiGlob[`../lib/assets/projects/${project.id}-ascii.txt`],
		image: imageGlob[`../lib/assets/projects/${project.id}.png`],
		imageAvif: imageAvifGlob[`../lib/assets/projects/${project.id}.avif`]
	}));

	let fieldWrap: HTMLDivElement | undefined;
	let hintX = $state(0);
	let hintY = $state(0);
	let hintOn = $state(false);

	function onFieldPointerMove(e: PointerEvent) {
		if (!fieldWrap) return;
		const r = fieldWrap.getBoundingClientRect();
		hintX = e.clientX - r.left;
		hintY = e.clientY - r.top;
	}

	const pad = (n: number) => String(n).padStart(3, '0');

	const itemMargin = (i: number) =>
		i % 3 === 1 ? 'lg:ml-[10%]' : i % 3 === 2 ? 'lg:ml-[20%]' : 'lg:ml-0';

	let mobileFieldEl: HTMLDivElement | undefined;
	let mobileW = $state(0);
	let mobileH = $state(0);
	$effect(() => {
		const el = mobileFieldEl;
		if (!el) return;
		const measure = () => {
			mobileW = el.clientWidth;
			mobileH = el.clientHeight;
		};
		measure();
		const ro = new ResizeObserver(measure);
		ro.observe(el);
		return () => ro.disconnect();
	});
	const MOBILE_HAND_W = 0.9;
	const mobileRegionH = $derived(mobileH ? Math.min(1, (MOBILE_HAND_W * mobileW) / mobileH) : 0.45);
	const mobileRegionY = $derived(mobileH ? Math.max(0, 1 - mobileRegionH) : 0.55);

	const ROLL_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	function makeRolls(text: string, seed: number): string[][] {
		return Array.from(text).map((ch, i) => {
			if (ch === ' ') return [];
			let s = seed * 7919 + i * 104729 + ch.charCodeAt(0) * 31;
			return Array.from({ length: 4 }, () => {
				s = (s * 1103515245 + 12345) & 0x7fffffff;
				return ROLL_CHARS[s % ROLL_CHARS.length];
			});
		});
	}
	const firstRolls = makeRolls(hero.cta.first, 1);
	const secondRolls = makeRolls(hero.cta.second, 2);
	const ctaRolls = makeRolls(code.cta.label, 3);

	let showCvModal = $state(false);
	function openCvModal() {
		showCvModal = true;
	}
	function closeCvModal() {
		showCvModal = false;
	}

	let introEl: HTMLElement | undefined;
	let winEl: HTMLDivElement | undefined;
	let winX = $state(0);
	let winY = $state(0);
	let winDragging = $state(false);
	let dragStartX = 0;
	let dragStartY = 0;
	let dragOriginX = 0;
	let dragOriginY = 0;
	let dragMinX = 0;
	let dragMaxX = 0;
	let dragMinY = 0;
	let dragMaxY = 0;

	function onWinTitleDown(e: PointerEvent) {
		if (e.button !== 0 || e.pointerType !== 'mouse') return;
		if (!introEl || !winEl) return;
		const wr = winEl.getBoundingClientRect();
		const sr = introEl.getBoundingClientRect();
		dragStartX = e.clientX;
		dragStartY = e.clientY;
		dragOriginX = winX;
		dragOriginY = winY;
		dragMinX = winX - (wr.left - sr.left);
		dragMaxX = winX + (sr.right - wr.right);
		dragMinY = winY - (wr.top - sr.top);
		dragMaxY = winY + (sr.bottom - wr.bottom);
		winDragging = true;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}

	function onWinTitleMove(e: PointerEvent) {
		if (!winDragging) return;
		const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
		winX = clamp(dragOriginX + e.clientX - dragStartX, dragMinX, dragMaxX);
		winY = clamp(dragOriginY + e.clientY - dragStartY, dragMinY, dragMaxY);
	}

	function onWinTitleUp() {
		winDragging = false;
	}

	onMount(() => {
		const hash = window.location.hash;
		if (!hash) return;
		document.querySelector(hash)?.scrollIntoView({ behavior: 'instant' });
	});
</script>

<section class="relative flex flex-col lg:h-screen lg:flex-row">
	<div
		class="relative flex min-h-[55vh] w-full flex-col bg-off-white px-16 pt-120 pb-48 lg:h-full lg:w-1/2 lg:justify-center lg:pt-0 lg:pr-0 lg:pb-0 lg:pl-80"
	>
		<div class="my-auto flex flex-col gap-24">
			<Reveal>
				<p class="mb-12 font-mono text-caption-20 font-medium text-dark-grey uppercase">
					{hero.eyebrow}
				</p>
			</Reveal>

			<h1 class="ascii-name mb-24">Azur</h1>
			<Reveal>
				<p class="max-w-[56ch] text-body-20 text-dark-grey">{hero.subtext}</p>
			</Reveal>

			<div class="mt-24 block w-full">
				<button
					type="button"
					onclick={openCvModal}
					class="group relative inline-flex w-fit cursor-pointer items-center font-mono text-body-10 whitespace-nowrap uppercase"
				>
					<span
						class="inline-flex h-48 items-center rounded-lg bg-black px-20 text-white transition-colors group-hover:bg-black-deep lg:px-24"
					>
						{#each Array.from(hero.cta.first) as ch, i (i)}
							{#if ch === ' '}
								<span class="ltr-space">&nbsp;</span>
							{:else}
								<span class="ltr" style="--i:{i}">
									<span class="ltr-stack">
										<span class="ltr-row">{ch}</span>
										{#each firstRolls[i] as r, ri (ri)}
											<span class="ltr-row" aria-hidden="true">{r}</span>
										{/each}
										<span class="ltr-row">{ch}</span>
									</span>
								</span>
							{/if}
						{/each}
					</span>
					<span
						aria-hidden="true"
						class="-mx-px flex w-6 flex-col text-black transition-colors group-hover:text-black-deep"
						style="height: 26px"
					>
						<span
							class="h-4 w-full shrink-0 bg-current"
							style="clip-path: path('M0 0H1C1 1.1046 1.8954 2 3 2C4.1046 2 5 1.1046 5 0H6V4H0Z')"
						></span>
						<span class="-my-px w-full grow bg-current"></span>
						<span
							class="h-4 w-full shrink-0 bg-current"
							style="clip-path: path('M0 0H6V4H5C5 2.8954 4.1046 2 3 2C1.8954 2 1 2.8954 1 4H0Z')"
						></span>
					</span>
					<span
						class="inline-flex h-48 items-center rounded-lg bg-black px-20 text-white transition-colors group-hover:bg-black-deep lg:px-24"
					>
						{#each Array.from(hero.cta.second) as ch, i (i)}
							{#if ch === ' '}
								<span class="ltr-space">&nbsp;</span>
							{:else}
								<span class="ltr" style="--i:{i}">
									<span class="ltr-stack">
										<span class="ltr-row">{ch}</span>
										{#each secondRolls[i] as r, ri (ri)}
											<span class="ltr-row" aria-hidden="true">{r}</span>
										{/each}
										<span class="ltr-row">{ch}</span>
									</span>
								</span>
							{/if}
						{/each}
					</span>
					<span aria-hidden="true" class="absolute top-8 right-8 flex size-6">
						<span
							class="absolute inline-flex size-6 animate-status-ping rounded-full bg-accent motion-reduce:hidden"
						></span>
						<span class="relative inline-flex size-6 rounded-full bg-accent"></span>
					</span>
				</button>
			</div>
		</div>

		<div
			class="pointer-events-none absolute bottom-0 left-0 hidden w-full px-16 pb-40 lg:block lg:px-80"
		>
			<span class="sr-only">{hero.stats.join(' ')}</span>
			<div aria-hidden="true" class="flex flex-col gap-y-4 font-mono text-caption-10 uppercase">
				<div class="flex flex-wrap items-baseline gap-x-16">
					{#each hero.stats.slice(0, 4) as stat (stat)}
						<span class="whitespace-pre text-black">{stat}</span>
					{/each}
				</div>
				<div class="flex flex-wrap items-baseline justify-end gap-x-16">
					{#each hero.stats.slice(4) as stat (stat)}
						<span class="whitespace-pre text-black">{stat}</span>
					{/each}
				</div>
			</div>
		</div>
	</div>

	<ScrollCta />

	<div class="h-[75vh] w-full bg-black lg:h-full lg:w-1/2">
		<TextRings />
	</div>
</section>

<section
	id="intro"
	bind:this={introEl}
	class="flex min-h-[75vh] items-center bg-off-white py-72 lg:py-160"
>
	<div class="mx-auto grid w-full grid-cols-1 gap-x-16 px-16 lg:grid-cols-12 lg:px-80">
		<div class="lg:col-span-7">
			<div
				class="carbon"
				bind:this={winEl}
				style={`transform: translate(${winX}px, ${winY}px); ${winDragging ? 'will-change: transform;' : ''}`}
			>
				<div class="rounded-6 overflow-hidden bg-black text-white ring-1 ring-white/10">
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						class="flex items-center gap-8 border-b border-white/10 px-16 py-12 select-none lg:cursor-grab {winDragging
							? 'lg:cursor-grabbing'
							: ''}"
						onpointerdown={onWinTitleDown}
						onpointermove={onWinTitleMove}
						onpointerup={onWinTitleUp}
						onpointercancel={onWinTitleUp}
					>
						<span class="font-mono text-caption-10 text-dark-grey">{whoami.title}</span>
						<span
							aria-hidden="true"
							class="ml-auto flex items-center gap-14 font-mono text-caption-10 leading-none text-white/40"
						>
							<span>-</span>
							<span>□</span>
							<span>✕</span>
						</span>
					</div>
					<div class="flex flex-col gap-20 px-20 py-24 lg:px-32 lg:py-28">
						<p class="font-mono text-caption-20 whitespace-nowrap">
							<span class="text-accent">{whoami.host}</span><span class="text-ghost-grey">
								{whoami.command}</span
							><span
								aria-hidden="true"
								class="ml-4 inline-block w-8 animate-cursor-blink text-accent">▍</span
							>
						</p>
						<div class="flex flex-col gap-16">
							{#each whoami.lines as line, i (i)}
								<Reveal>
									<p class="max-w-[56ch] text-body-20 text-ghost-grey">{line}</p>
								</Reveal>
							{/each}
						</div>
						<Reveal>
							<p
								class="max-w-[56ch] border-t border-white/10 pt-20 text-body-30 leading-snug font-medium text-white"
							>
								<span aria-hidden="true" class="mr-8 text-accent">&gt;</span>{whoami.punchline}
							</p>
						</Reveal>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<section id="work" class="relative isolate bg-[#181818] py-72 text-white lg:py-160">
	<div class="pointer-events-none absolute inset-0 -z-1">
		<GlyphField
			interactive={false}
			viewportCell
			maxFps={30}
			dpr={1}
			background="#181818"
			phrase="PROJECTS TOOLS AWARDS "
		/>
	</div>
	<div class="relative mx-auto w-full max-w-[1920px] px-16 lg:px-80">
		<div class="mb-64 flex flex-col gap-24">
			<Reveal>
				<p class="font-mono text-caption-20 font-medium text-dark-grey uppercase">
					{work.eyebrow}
				</p>
			</Reveal>
			<Reveal>
				<h2 class="text-headline-10 font-medium whitespace-pre-line">{work.title}</h2>
			</Reveal>
			<Reveal>
				<p class="max-w-[56ch] text-body-20 text-ghost-grey">{work.subtext}</p>
			</Reveal>
		</div>
		<div class="grid grid-cols-1 gap-x-16 gap-y-24 lg:grid-cols-2 lg:gap-y-40">
			{#each items as item, i (item.project.id)}
				<ProjectCard
					project={item.project}
					ascii={item.ascii}
					image={item.image}
					imageAvif={item.imageAvif}
					index={i}
				/>
			{/each}
			{#each Array(Math.max(0, 6 - items.length)) as _, k (k)}
				<div class="aspect-video border border-dashed border-white/20"></div>
			{/each}
		</div>
	</div>
</section>

<section id="experience" class="relative isolate bg-[#181818] py-72 text-white lg:py-160">
	<div class="pointer-events-none absolute inset-0 -z-1">
		<GlyphField
			interactive={false}
			viewportCell
			maxFps={30}
			dpr={1}
			background="#181818"
			phrase="EXPERIENCE WORK ROLES "
		/>
	</div>
	<ExperienceSlider />
</section>

<StatusContact />

<section id="how-i-think" class="relative isolate min-h-svh bg-[#181818] text-white">
	<div class="absolute inset-0 -z-1 hidden lg:block">
		<div class="sticky top-0 h-svh">
			<div
				role="presentation"
				bind:this={fieldWrap}
				class="relative size-full cursor-pointer overflow-hidden"
				onpointermove={onFieldPointerMove}
				onpointerenter={() => (hintOn = true)}
				onpointerleave={() => (hintOn = false)}
			>
				<GlyphField hand background="#181818" maxFps={30} dpr={1.5}>
					<div
						aria-hidden="true"
						class="pointer-events-none absolute top-0 left-0 z-2 translate-x-20 translate-y-20 bg-white p-2 font-mono text-caption-10 whitespace-nowrap text-black uppercase transition-opacity duration-150 select-none {hintOn
							? 'opacity-100'
							: 'opacity-0'}"
						style="left: {hintX}px; top: {hintY}px"
					>
						Click
					</div>
				</GlyphField>
				<div aria-hidden="true" class="pointer-events-none absolute inset-0 bg-black-deep/30"></div>
			</div>
		</div>
	</div>
	<div
		class="pointer-events-none grid grid-cols-1 gap-16 px-16 pt-72 pb-[100vw] lg:grid-cols-12 lg:px-80 lg:pt-160 lg:pb-160"
	>
		<div class="lg:col-span-6">
			<div class="flex flex-col gap-32">
				<Reveal class="pointer-events-auto">
					<h2 class="text-headline-10 font-medium whitespace-pre-line">
						{howIThink.title}
					</h2>
				</Reveal>
				<Reveal class="pointer-events-auto">
					<p class="max-w-[56ch] text-body-20 text-ghost-grey">{howIThink.intro}</p>
				</Reveal>
			</div>
		</div>
		<ul class="mt-80 flex flex-col gap-64 lg:col-span-12">
			{#each howIThink.items as item, i (item.title)}
				<li class="pointer-events-auto flex flex-col gap-12 lg:max-w-1/3 {itemMargin(i)}">
					<Reveal>
						<h3 class="font-mono text-caption-20 uppercase">{pad(i + 1)} / {item.title}</h3>
					</Reveal>
					<Reveal>
						<p class="text-body-10 whitespace-pre-line text-ghost-grey">{item.text}</p>
					</Reveal>
				</li>
			{/each}
		</ul>
	</div>

	<div class="absolute inset-0 -z-1 lg:hidden" bind:this={mobileFieldEl}>
		<GlyphField
			hand
			viewportCell
			background="#181818"
			maxFps={30}
			dpr={2}
			regionWidthFraction={MOBILE_HAND_W}
			regionHeightFraction={mobileRegionH}
			regionXFraction={(1 - MOBILE_HAND_W) / 2}
			regionYFraction={mobileRegionY}
		/>
	</div>
</section>

<section id="the-code" class="bg-off-white py-72 text-black lg:py-160">
	<div class="mx-auto flex w-full max-w-[1600px] flex-col gap-48 px-16 lg:gap-64 lg:px-80">
		<div class="flex flex-col gap-24">
			<Reveal>
				<p class="font-mono text-caption-20 font-medium text-dark-grey uppercase">
					{code.eyebrow}
				</p>
			</Reveal>
			<Reveal>
				<h2 class="text-headline-10 font-medium">{code.title}</h2>
			</Reveal>
			<Reveal>
				<p class="max-w-[56ch] text-body-20 text-dark-grey">{code.subtext}</p>
			</Reveal>
		</div>

		<LazyMount
			load={() => import('$lib/components/CodeEditor.svelte')}
			minHeight="calc(72vh + 110px)"
		/>

		<a
			href={code.cta.href}
			target="_blank"
			rel="noopener"
			class="group inline-flex w-fit items-center gap-6 font-mono text-caption-20 text-dark-grey uppercase transition-colors hover:text-accent"
		>
			{#each Array.from(code.cta.label) as ch, i (i)}
				{#if ch === ' '}
					<span class="ltr-space">&nbsp;</span>
				{:else}
					<span class="ltr" style="--i:{i}">
						<span class="ltr-stack">
							<span class="ltr-row">{ch}</span>
							{#each ctaRolls[i] as r, ri (ri)}
								<span class="ltr-row" aria-hidden="true">{r}</span>
							{/each}
							<span class="ltr-row">{ch}</span>
						</span>
					</span>
				{/if}
			{/each}
			<span aria-hidden="true">↗</span>
		</a>
	</div>
</section>

<Faq />

<div class="relative isolate">
	<div class="relative z-10 bg-off-white px-16 py-72 lg:p-80">
		<div class="relative">
			<div
				class="rounded-8 bg-black-deep p-6 shadow-lg ring ring-black-deep transition-colors duration-300 lg:p-8"
				style="background-image: repeating-conic-gradient(rgba(255,255,255,0.22) 0% 25%, transparent 0% 50%); background-size: 4px 4px"
			>
				<div
					class="isolate flex flex-col overflow-hidden rounded-4 bg-black font-mono text-caption-10 text-white ring-1 ring-white/10"
				>
					<div class="flex h-26 items-center border-b border-white/10 px-16">
						<span class="tracking-wide text-white/40 uppercase">End of file</span>
					</div>

					<div class="@container flex flex-col gap-48 overflow-hidden p-16">
						<pre
							role="img"
							aria-label="Works on my machine"
							class="footer-art m-0 w-full overflow-hidden leading-none whitespace-pre"
							style="font-size: calc(100cqw / 80)">{footerArt1}</pre>
						<pre
							aria-hidden="true"
							class="footer-art m-0 w-full overflow-hidden leading-none whitespace-pre"
							style="font-size: calc(100cqw / 80)">{footerArt2}</pre>
					</div>
				</div>
			</div>
		</div>
	</div>
	<Footer />
</div>

<CvModal open={showCvModal} on:close={closeCvModal} />

<style>
	.carbon {
		border: 1px solid #000;
		border-radius: calc(var(--spacing) * 8);
		padding: calc(var(--spacing) * 6);
		background-color: var(--color-black-deep);
		background-image: repeating-conic-gradient(
			rgba(255, 255, 255, 0.22) 0%,
			rgba(255, 255, 255, 0.22) 25%,
			transparent 0%,
			transparent 50%
		);
		background-size: 4px 4px;
		box-shadow:
			0 10px 15px -3px rgb(0 0 0 / 0.1),
			0 4px 6px -4px rgb(0 0 0 / 0.1);
	}

	.ascii-name {
		margin: 0;
		font-family: 'Upheaval', var(--font-mono), monospace;
		font-weight: 400;
		color: var(--color-black);
		line-height: 1;
		letter-spacing: 0;
		text-transform: uppercase;
		font-size: clamp(100px, 13vw, 200px);
	}

	.ltr {
		--lh: 1.2em;
		display: inline-block;
		position: relative;
		overflow: hidden;
		vertical-align: top;
		height: var(--lh);
		line-height: var(--lh);
	}
	.ltr-space {
		display: inline-block;
		width: 0.6em;
	}
	.ltr-stack {
		display: flex;
		flex-direction: column;
		transition: transform 0.45s cubic-bezier(0.65, 0, 0.35, 1);
		transition-delay: calc(var(--i) * 22ms);
		will-change: transform;
	}
	.ltr-row {
		display: block;
		white-space: pre;
		height: var(--lh);
		line-height: var(--lh);
	}
	.group:hover .ltr-stack,
	.group:focus-visible .ltr-stack {
		transform: translateY(calc(var(--lh) * -5));
	}
	@media (prefers-reduced-motion: reduce) {
		.ltr-stack {
			transition: none;
		}
	}

	.footer-art {
		line-height: 1;
		user-select: none;
	}
</style>
