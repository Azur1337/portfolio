<script lang="ts">
	import GlyphField from '$lib/components/canvas/GlyphField.svelte';
	import { status } from '$lib/data/status';
	import { email } from '$lib/email';
	import { resolve } from '$app/paths';

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
	const first = 'Say';
	const second = 'hello';
	const firstRolls = makeRolls(first, 1);
	const secondRolls = makeRolls(second, 2);

	const links = [
		{ label: 'GitHub', href: status.githubUrl, external: true },
		{ label: 'LinkedIn', href: status.linkedinUrl, external: true },
		{ label: 'Blog', href: resolve('/blog'), external: false },
		{ label: 'Imprint', href: resolve('/imprint'), external: false }
	];
	const linkRolls = links.map((l, i) => makeRolls(l.label, i + 1));
</script>

<footer id="footer" class="sticky bottom-0 z-0 h-[45vh] bg-[#181818] text-white">
	<div class="pointer-events-none absolute inset-0 -z-1">
		<GlyphField
			interactive={false}
			viewportCell
			maxFps={30}
			dpr={1}
			background="#181818"
			phrase="WEB · SYSTEMS · DESIGN · ENGINEERING · PERFORMANCE · "
		/>
	</div>

	<div class="relative flex h-full w-full flex-col p-24 lg:p-80">
		<div class="flex flex-col gap-40 lg:flex-row lg:items-start lg:justify-between">
			<a
				href="mailto:{email}"
				class="group relative inline-flex w-fit cursor-pointer items-center gap-8 font-mono text-body-10 whitespace-nowrap uppercase"
			>
				<span
					class="inline-flex h-48 items-center rounded-lg border border-white/15 bg-black-deep/60 px-20 text-ghost-grey lowercase transition-colors group-hover:border-white/30 group-hover:text-white lg:px-24"
				>
					{email}
				</span>

				<span class="inline-flex items-center">
					<span
						class="inline-flex h-48 items-center rounded-lg bg-off-white px-20 text-black transition-colors group-hover:bg-white lg:px-24"
					>
						{#each Array.from(first) as ch, i (i)}
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
						{#each Array.from(second) as ch, i (i)}
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
				</span>
			</a>

			<nav aria-label="Footer" class="flex flex-col gap-12 font-mono text-caption-20 lg:items-end">
				{#each links as link, li (link.label)}
					<a
						href={link.href}
						target={link.external ? '_blank' : undefined}
						rel={link.external ? 'noreferrer' : undefined}
						class="footlink uppercase"
					>
						{#each Array.from(link.label) as ch, ci (ci)}
							{#if ch === ' '}
								<span class="ltr-space">&nbsp;</span>
							{:else}
								<span class="ltr" style="--i:{ci}">
									<span class="ltr-stack">
										<span class="ltr-row">{ch}</span>
										{#each linkRolls[li][ci] as r, ri (ri)}
											<span class="ltr-row" aria-hidden="true">{r}</span>
										{/each}
										<span class="ltr-row">{ch}</span>
									</span>
								</span>
							{/if}
						{/each}
					</a>
				{/each}
			</nav>
		</div>

		<div class="mt-auto pt-24 lg:pt-80">
			<div aria-hidden="true" class="border-t border-white/10"></div>
			<p class="mt-16 font-mono text-caption-10 text-white uppercase">© 2026 Azur</p>
		</div>
	</div>
</footer>

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

	.footlink {
		display: inline-flex;
		align-items: center;
		width: fit-content;
		text-decoration: none;
		color: #8a8a8a;
		transition: color 0.25s ease;
	}
	.footlink:hover,
	.footlink:focus-visible {
		color: #d6d6d6;
	}
	.footlink:hover .ltr-stack,
	.footlink:focus-visible .ltr-stack {
		transform: translateY(calc(var(--lh) * -5));
	}
	.footlink:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 3px;
		border-radius: calc(var(--spacing) * 4);
	}

	@media (prefers-reduced-motion: reduce) {
		.ltr-stack {
			transition: none;
		}
	}
</style>
