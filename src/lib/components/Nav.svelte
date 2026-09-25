<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { anchorScroll, lenisInstance, scrollEase } from '$lib/stores/lenis';

	interface NavItem {
		label: string;
		href: string;

		dot?: boolean;
	}

	const items: NavItem[] = [
		{ label: 'APPROACH', href: '#how-i-think' },
		{ label: 'CODE', href: '#the-code' },
		{ label: 'WORK', href: '#work' },
		{ label: 'STATUS', href: '#offer', dot: true },
		{ label: 'FAQ', href: '#faq' },
		{ label: 'BLOG', href: '/blog' }
	];

	const isAnchor = (href: string) => href.startsWith('#');

	const onHome = $derived(page.route.id === '/');
	const hrefFor = (href: string) => (isAnchor(href) && !onHome ? `/${href}` : href);

	function onNavClick(e: MouseEvent, href: string) {
		if (isAnchor(href) && !onHome) return;
		anchorScroll(e, href);
	}

	const iconHref = $derived(onHome ? '#top' : resolve('/'));
	function onIconClick(e: MouseEvent) {
		if (!onHome) return;
		e.preventDefault();
		const lenis = lenisInstance.current;
		if (lenis) lenis.scrollTo(0, { easing: scrollEase, duration: 1.2 });
		else window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	const isExternal = (href: string) => /^https?:\/\//.test(href);

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
	const itemRolls = items.map((item, i) => makeRolls(item.label, i + 1));

	const marqueePhrase = 'AVAILABLE FOR PART-TIME & FREELANCE';

	const marqueeHalf = Array(6)
		.fill(marqueePhrase + '    ')
		.join('');

	let menuOpen = $state(false);

	let activeIndex = $state(-1);
	let highlightX = $state(0);
	let highlightW = $state(0);
	let highlightOn = $state(false);
	let desktopWrap: HTMLDivElement | undefined;
	let ticking = false;

	const NAV_SCALE = 1.05;

	const HIGHLIGHT_PAD_X = 8;

	function positionHighlight() {
		if (!desktopWrap) return;
		const links = desktopWrap.querySelectorAll<HTMLAnchorElement>('.navlink');
		if (activeIndex < 0 || activeIndex >= links.length) {
			highlightOn = false;
			return;
		}
		const link = links[activeIndex];
		const wrapRect = desktopWrap.getBoundingClientRect();
		const linkRect = link.getBoundingClientRect();
		highlightX = (linkRect.left - wrapRect.left) / NAV_SCALE - HIGHLIGHT_PAD_X;
		highlightW = linkRect.width / NAV_SCALE + HIGHLIGHT_PAD_X * 2;
		highlightOn = true;
	}

	function updateActive() {
		if (!onHome) {
			if (activeIndex !== -1) {
				activeIndex = -1;
				positionHighlight();
			}
			return;
		}
		const threshold = window.innerHeight * 0.4;
		let current = -1;
		for (let i = 0; i < items.length; i++) {
			if (!isAnchor(items[i].href)) continue;
			const el = document.querySelector(items[i].href);
			if (!el) continue;
			if (el.getBoundingClientRect().top <= threshold) current = i;
		}
		if (current !== activeIndex) {
			activeIndex = current;
			positionHighlight();
		}
	}

	function onScroll() {
		if (ticking) return;
		ticking = true;
		requestAnimationFrame(() => {
			updateActive();
			ticking = false;
		});
	}

	function onResize() {
		updateActive();
		positionHighlight();
	}

	onMount(() => {
		const boot = () => {
			updateActive();
			positionHighlight();
		};
		if (document.fonts?.ready) document.fonts.ready.then(boot).catch(boot);
		else boot();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onResize);
		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onResize);
		};
	});

	$effect(() => {
		updateActive();
	});
</script>

<nav class="nav" aria-label="Primary">
	<div class="carbon">
		<div class="panel">
			<div class="toprow">
				<a
					class="icon"
					href={iconHref}
					aria-label={onHome ? 'Back to top' : 'Back to home'}
					onclick={onIconClick}
				>
					<svg
						class="icon-svg"
						viewBox="0 0 268 242"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						aria-hidden="true"
					>
						<path
							d="M206.846 138C225.846 126.5 229.346 125.5 245.346 123M22.8465 210.5C99.0357 141.313 142.516 112.72 221.346 79M46.8465 179C112.48 122.703 149.937 99.4377 217.846 72M80.3465 140.5C131.395 100.514 160.528 83.9884 213.346 64.5M113.846 106C150.502 80.2193 171.421 69.5649 209.346 57M141.846 79C166.411 64.2682 180.43 58.1799 205.846 51M163.346 59.5C178.316 51.871 186.858 48.7182 202.346 45M119.346 78C150.052 57.2176 167.576 48.6289 199.346 38.5M125.846 65.5C152.522 48.4006 167.746 41.3339 195.346 33M131.846 54C155.068 39.7943 168.32 33.9235 192.346 27M138.346 42.5C157.922 31.1881 169.093 26.5132 189.346 21M144.346 32C160.083 23.3187 169.064 19.731 185.346 15.5M149.346 22C161.821 15.4233 168.94 12.7053 181.846 9.5M153.846 13C163.442 8.0017 168.918 5.93606 178.846 3.5M158.846 3.5C165.18 0.343179 168.794 -0.961439 175.346 -2.5M164.346 -5C167.417 -6.31534 169.169 -6.85893 172.346 -7.5M166.346 -12.5C166.346 -12.5 168.346 -13 168.846 -13M0.346466 241.5C85.7475 159.423 135.985 124.503 224.346 84.5M52.3465 208C131.846 143 166.846 119 229.346 92M100.846 182C163.346 136 178.749 126.361 233.346 100.5M168.846 148.5C202.346 125.5 209.346 121.5 239.346 112M217.846 146.5C234.626 136.533 237.717 135.667 251.846 133.5M224.346 156.5C240.385 146.917 243.34 146.083 256.846 144M229.346 166C245.385 156.417 248.34 155.583 261.846 153.5M251.846 166C259.496 163.317 260.905 163.083 267.346 162.5"
							stroke="currentColor"
							stroke-width="4"
						/>
					</svg>
				</a>

				<div class="desktop-wrap" bind:this={desktopWrap}>
					<div
						class="highlight"
						class:on={highlightOn}
						style="transform: translateX({highlightX}px); width: {highlightW}px"
					></div>
					<ul class="desktop">
						{#each items as item, itemIndex (item.label)}
							<li>
								<a
									class="navlink"
									class:active={itemIndex === activeIndex}
									href={hrefFor(item.href)}
									target={isExternal(item.href) ? '_blank' : undefined}
									rel={isExternal(item.href) ? 'noreferrer' : undefined}
									onclick={(e) => onNavClick(e, item.href)}
								>
									{#each Array.from(item.label) as ch, charIndex (charIndex)}
										{#if ch === ' '}
											<span class="ltr-space">&nbsp;</span>
										{:else}
											<span class="ltr" style="--i:{charIndex}">
												<span class="ltr-stack">
													<span class="ltr-row">{ch}</span>
													{#each itemRolls[itemIndex][charIndex] as r, ri (ri)}
														<span class="ltr-row" aria-hidden="true">{r}</span>
													{/each}
													<span class="ltr-row">{ch}</span>
												</span>
											</span>
										{/if}
									{/each}
									{#if item.dot}<span class="dot" aria-hidden="true"></span>{/if}
								</a>
							</li>
						{/each}
					</ul>
				</div>

				<div class="mobile">
					<span class="menutitle">Menu</span>
					<button
						class="toggle"
						type="button"
						aria-expanded={menuOpen}
						aria-label={menuOpen ? 'Close menu' : 'Open menu'}
						onclick={() => (menuOpen = !menuOpen)}
					>
						<span class="toggle-glyph" aria-hidden="true">{menuOpen ? '−' : '+'}</span>
					</button>
				</div>
			</div>

			<div class="dropdown-wrap {menuOpen ? 'open' : ''}">
				<div class="dropdown-clip">
					<ul class="dropdown">
						{#each items as item (item.label)}
							<li>
								<a
									class="dropdownlink"
									href={hrefFor(item.href)}
									target={isExternal(item.href) ? '_blank' : undefined}
									rel={isExternal(item.href) ? 'noreferrer' : undefined}
									onclick={(e) => {
										menuOpen = false;
										onNavClick(e, item.href);
									}}
								>
									{item.label}
									{#if item.dot}<span class="dot-inline" aria-hidden="true"></span>{/if}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			</div>

			<div class="marquee" aria-hidden="true">
				<div class="track">
					<span class="half">{marqueeHalf}</span>
					<span class="half">{marqueeHalf}</span>
				</div>
			</div>
		</div>
	</div>
</nav>

<style>
	.nav {
		position: fixed;
		top: calc(var(--spacing) * 16);
		left: 50%;
		transform: translateX(-50%) scale(1.05);
		transform-origin: top center;
		z-index: 50;

		width: max-content;
		max-width: calc(100vw - var(--spacing) * 32);
	}

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

	.panel {
		display: flex;
		flex-direction: column;
		gap: calc(var(--spacing) * 4);
		padding: calc(var(--spacing) * 4);
		border-radius: calc(var(--spacing) * 2);
		background: var(--color-black);
		box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1);
	}

	.toprow {
		display: flex;
		align-items: center;
		gap: calc(var(--spacing) * 16);
	}

	.icon {
		flex-shrink: 0;
		display: grid;
		place-items: center;
		width: calc(var(--spacing) * 30);
		height: calc(var(--spacing) * 30);
		border-radius: calc(var(--spacing) * 6);
		color: var(--color-off-white);
		text-decoration: none;
	}
	.icon-svg {
		width: 100%;
		height: 100%;
	}

	.desktop-wrap {
		position: relative;
		display: flex;
		align-items: center;
	}

	.highlight {
		position: absolute;
		top: calc(var(--spacing) * -4);
		left: 0;
		height: calc(100% + var(--spacing) * 8);
		border-radius: calc(var(--spacing) * 2);
		background: rgba(255, 255, 255, 0.07);
		box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.14);
		opacity: 0;
		z-index: 0;
		will-change: transform, width;
		transition:
			transform 0.45s cubic-bezier(0.65, 0, 0.35, 1),
			width 0.45s cubic-bezier(0.65, 0, 0.35, 1),
			opacity 0.3s ease;
	}
	.highlight.on {
		opacity: 1;
	}
	.desktop {
		position: relative;
		z-index: 1;
		display: flex;
		align-items: center;
		gap: calc(var(--spacing) * 20);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.navlink {
		position: relative;
		display: inline-flex;
		align-items: center;
		font-family: var(--font-mono);
		font-size: var(--text-caption-10);
		line-height: 1.2;
		text-transform: uppercase;
		white-space: nowrap;
		text-decoration: none;
		color: #8a8a8a;
		transition: color 0.25s ease;
	}
	.navlink:hover,
	.navlink:focus-visible {
		color: #d6d6d6;
	}

	.navlink.active {
		color: var(--color-white);
	}

	.desktop li:last-child .navlink {
		padding-right: calc(var(--spacing) * 12);
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
	.navlink:hover .ltr-stack,
	.navlink:focus-visible .ltr-stack {
		transform: translateY(calc(var(--lh) * -5));
	}

	.dot {
		position: absolute;
		top: calc(var(--spacing) * -3);
		right: calc(var(--spacing) * -9);
		width: calc(var(--spacing) * 6);
		height: calc(var(--spacing) * 6);
		border-radius: 50%;
		background: var(--color-accent);
	}
	.dot::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: 50%;
		background: var(--color-accent);
		z-index: -1;
		animation: status-ping 1.6s cubic-bezier(0, 0, 0.2, 1) infinite;
	}

	.mobile {
		display: none;
		align-items: center;
		gap: calc(var(--spacing) * 16);
	}
	.menutitle {
		font-family: var(--font-sans);
		font-size: var(--text-body-20);
		color: var(--color-white);
	}
	.toggle {
		display: grid;
		place-items: center;
		width: calc(var(--spacing) * 28);
		height: calc(var(--spacing) * 28);
		border: none;
		border-radius: calc(var(--spacing) * 6);
		background: #333;
		color: var(--color-white);
		cursor: pointer;
		transition: background 0.2s ease;
	}
	.toggle:hover {
		background: #3d3d3d;
	}
	.toggle-glyph {
		font-family: var(--font-mono);
		font-size: calc(var(--spacing) * 20);
		line-height: 1;
	}

	.dropdown-wrap {
		display: grid;
		grid-template-rows: 0fr;
		visibility: hidden;
		transition:
			grid-template-rows 0.35s cubic-bezier(0.4, 0, 0.2, 1),
			visibility 0s linear 0.35s;
	}
	.dropdown-wrap.open {
		grid-template-rows: 1fr;
		visibility: visible;
		transition:
			grid-template-rows 0.35s cubic-bezier(0.4, 0, 0.2, 1),
			visibility 0s;
	}
	.dropdown-clip {
		overflow: hidden;
		min-height: 0;
	}
	.dropdown {
		display: flex;
		flex-direction: column;
		margin: 0;
		padding: calc(var(--spacing) * 4) 0 0;
		list-style: none;
	}
	.dropdownlink {
		display: flex;
		align-items: center;
		gap: calc(var(--spacing) * 8);

		padding: calc(var(--spacing) * 16) 0;
		font-family: var(--font-mono);
		font-size: var(--text-caption-20);
		letter-spacing: 0.06em;
		text-transform: uppercase;
		text-decoration: none;
		color: #8a8a8a;
		transition: color 0.2s ease;
	}
	.dropdownlink:hover,
	.dropdownlink:focus-visible {
		color: var(--color-white);
	}
	.dot-inline {
		width: calc(var(--spacing) * 6);
		height: calc(var(--spacing) * 6);
		border-radius: 50%;
		background: var(--color-accent);
	}

	.marquee {
		position: relative;
		overflow: hidden;
		border-radius: calc(var(--spacing) * 2);
		background: var(--color-ghost-grey);
		height: calc(var(--spacing) * 16);
	}
	.track {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		display: flex;
		align-items: center;
		white-space: nowrap;
		will-change: transform;
		animation: marquee 40s linear infinite;
	}

	.marquee:hover .track {
		animation-play-state: paused;
	}
	.half {
		display: inline-block;
		white-space: pre;
		font-family: var(--font-mono);
		font-size: var(--text-ui);
		text-transform: uppercase;
		color: var(--color-black);
	}
	@keyframes marquee {
		to {
			transform: translateX(-50%);
		}
	}

	.navlink:focus-visible,
	.dropdownlink:focus-visible,
	.toggle:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 3px;
		border-radius: calc(var(--spacing) * 4);
	}

	@media (max-width: 1023px) {
		.nav {
			left: calc(var(--spacing) * 16);
			transform: scale(1.05);
			transform-origin: top left;
		}
		.desktop-wrap {
			display: none;
		}
		.mobile {
			display: flex;
		}
	}
	@media (min-width: 1024px) {
		.carbon {
			padding: calc(var(--spacing) * 8);
		}
		.mobile {
			display: none;
		}
		.dropdown-wrap {
			display: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.track {
			animation: none;
		}
		.dot::before {
			animation: none;
		}
		.ltr-stack,
		.highlight,
		.dropdown-wrap {
			transition: none;
		}
	}
</style>
