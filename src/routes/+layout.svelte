<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import AsciiTransition from '$lib/components/AsciiTransition.svelte';
	import SmoothScroll from '$lib/components/SmoothScroll.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import { profile } from '$lib/data/profile';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Azur · Fullstack Engineer &amp; UI/UX Designer</title>
	<meta name="description" content={profile.tagline} />
	<meta name="theme-color" content="#f1eee7" />

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Azur" />
	<meta property="og:title" content="Azur · Fullstack Engineer &amp; UI/UX Designer" />
	<meta property="og:description" content={profile.tagline} />
	<meta property="og:url" content={profile.links.portfolio} />
	<meta property="og:image" content={`${profile.links.portfolio}/og.png`} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Azur · Fullstack Engineer &amp; UI/UX Designer" />
	<meta name="twitter:description" content={profile.tagline} />
	<meta name="twitter:image" content={`${profile.links.portfolio}/og.png`} />
</svelte:head>

<SmoothScroll>
	{@render children()}
</SmoothScroll>

<Nav />

<AsciiTransition />
