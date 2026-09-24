<script lang="ts">
	import { onMount } from 'svelte';
	import GlyphField from '$lib/components/canvas/GlyphField.svelte';
	import Reveal from '$lib/components/Reveal.svelte';
	import { faq } from '$lib/data/faq';
	import { anchorScroll } from '$lib/stores/lenis';
	import { loadAnimationEngine } from '$lib/stores/animation-engine';

	type ScrollTriggerInstance = InstanceType<typeof import('gsap/ScrollTrigger').ScrollTrigger>;

	let open = $state(-1);

	function toggle(i: number) {
		open = open === i ? -1 : i;
	}

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
	const firstRolls = makeRolls(faq.cta.first, 1);
	const secondRolls = makeRolls(faq.cta.second, 2);

	let sectionEl: HTMLElement | undefined;
	let ctaEl: HTMLDivElement | undefined;
	let lastItemEl: HTMLLIElement | undefined;

	function trackLast(el: HTMLLIElement, i: number) {
		if (i === faq.items.length - 1) lastItemEl = el;
		return {
			destroy() {
				if (lastItemEl === el) lastItemEl = undefined;
			}
		};
	}

	onMount(() => {
		const section = sectionEl;
		const cta = ctaEl;
		const last = lastItemEl;
		if (!section || !cta || !last) return;

		const mq = window.matchMedia('(min-width: 1024px)');
		let st: ScrollTriggerInstance | undefined;
		let disposed = false;
		let teardown: (() => void) | undefined;

		const disable = () => {
			st?.kill();
			st = undefined;
			cta.style.bottom = '';
			cta.style.transform = '';
			cta.style.opacity = '';
			cta.style.pointerEvents = '';
		};

		loadAnimationEngine().then(({ ScrollTrigger }) => {
			if (disposed) return;

			const enable = () => {
				const vh = () => window.innerHeight;

				const ctaBottomOffset = 160 + last.offsetHeight / 2 - cta.offsetHeight / 2;
				cta.style.bottom = `${ctaBottomOffset}px`;

				const ctaTopDoc = () =>
					section.getBoundingClientRect().top +
					window.scrollY +
					section.offsetHeight -
					ctaBottomOffset -
					cta.offsetHeight;

				const releaseScroll = () => ctaTopDoc() - (vh() - ctaBottomOffset - cta.offsetHeight);

				const appearScroll = () =>
					section.getBoundingClientRect().top +
					window.scrollY +
					(section.offsetHeight * 2) / 3 -
					vh();

				st = ScrollTrigger.create({
					trigger: section,
					start: 'top bottom',
					end: 'bottom top',
					onUpdate() {
						const s = window.scrollY;

						const y = Math.min(s - releaseScroll(), 0);

						const opacity = Math.max(0, Math.min(1, (s - appearScroll()) / 200));
						cta.style.transform = `translateY(${y}px)`;
						cta.style.opacity = String(opacity);
						cta.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none';
					}
				});
				st.update();
			};

			const onChange = () => (mq.matches ? enable() : disable());
			onChange();
			mq.addEventListener('change', onChange);

			const ro = new ResizeObserver(() => {
				ScrollTrigger.refresh();
				st?.update();
			});
			ro.observe(section);

			teardown = () => {
				mq.removeEventListener('change', onChange);
				ro.disconnect();
			};
		});

		return () => {
			disposed = true;
			teardown?.();
			disable();
		};
	});
</script>

<section id="faq" class="relative isolate bg-[#181818] text-white" bind:this={sectionEl}>
	<div class="pointer-events-none absolute inset-0 -z-1">
		<GlyphField
			interactive={false}
			viewportCell
			maxFps={30}
			dpr={1}
			background="#181818"
			phrase="BEFORE YOU HIRE QUESTIONS ANSWERS "
		/>
	</div>
	<div class="relative z-10 w-full px-16 pt-72 pb-160 lg:px-80 lg:pt-160 lg:pb-160">
		<div class="grid grid-cols-1 gap-x-16 gap-y-64 lg:grid-cols-12">
			<div class="lg:col-span-4 lg:pb-120">
				<div class="lg:sticky lg:top-40">
					<Reveal>
						<p class="mb-12 font-mono text-caption-20 font-medium text-dark-grey uppercase">
							{faq.eyebrow}
						</p>
					</Reveal>
					<Reveal>
						<h2 class="text-headline-20 leading-none font-medium text-balance whitespace-pre-line">
							{faq.title.join('\n')}
						</h2>
					</Reveal>
				</div>
			</div>

			<div class="lg:col-span-8">
				<ul class="flex flex-col">
					{#each faq.items as item, i (item.q)}
						<li use:trackLast={i} class="border-b border-white/10">
							<button
								type="button"
								class="group flex w-full items-center gap-16 py-24 text-left"
								aria-expanded={open === i}
								onclick={() => toggle(i)}
							>
								<span class="w-56 shrink-0 font-mono text-caption-10 text-dark-grey tabular-nums">
									0.{String(i + 1).padStart(3, '0')}
								</span>
								<span
									class="grow font-mono text-caption-20 tracking-wide text-ghost-grey uppercase transition-colors group-hover:text-white"
								>
									{item.q}
								</span>
								<span
									class="flex size-24 shrink-0 items-center justify-center rounded-4 bg-white/5 text-white/70 transition-colors group-hover:bg-white/10 group-hover:text-white"
									aria-hidden="true"
								>
									{#if open === i}
										<span class="block h-2 w-12 bg-current"></span>
									{:else}
										<span class="relative block size-12">
											<span class="absolute top-1/2 left-0 h-2 w-full -translate-y-1/2 bg-current"
											></span>
											<span class="absolute top-0 left-1/2 h-full w-2 -translate-x-1/2 bg-current"
											></span>
										</span>
									{/if}
								</span>
							</button>
							<div
								class="grid transition-[grid-template-rows] duration-500 ease-in-out motion-reduce:transition-none"
								style="grid-template-rows: {open === i ? '1fr' : '0fr'}"
							>
								<div class="overflow-hidden">
									<p class="max-w-[64ch] pr-16 pb-32 pl-28 text-body-20 text-ghost-grey">
										{item.a}
									</p>
								</div>
							</div>
						</li>
					{/each}
				</ul>
			</div>
		</div>

		<div
			class="mt-64 lg:pointer-events-none lg:absolute lg:bottom-80 lg:left-80 lg:mt-0"
			bind:this={ctaEl}
		>
			<a
				href={faq.cta.href}
				onclick={(e) => anchorScroll(e, faq.cta.href)}
				class="group relative inline-flex w-fit cursor-pointer items-center font-mono text-body-10 whitespace-nowrap uppercase"
			>
				<span
					class="inline-flex h-48 items-center rounded-lg bg-off-white px-20 text-black transition-colors group-hover:bg-white lg:px-24"
				>
					{#each Array.from(faq.cta.first) as ch, i (i)}
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
					class="-mx-px flex w-6 flex-col text-off-white transition-colors group-hover:text-white"
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
					class="inline-flex h-48 items-center rounded-lg bg-off-white px-20 text-black transition-colors group-hover:bg-white lg:px-24"
				>
					{#each Array.from(faq.cta.second) as ch, i (i)}
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
			</a>
		</div>
	</div>
</section>

<style>
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
</style>
