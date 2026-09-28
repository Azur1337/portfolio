export const work = {
	eyebrow: 'Selected work',

	title: 'Things I have built,\nend to end.',

	subtext:
		'A handful of projects across the stack: award-winning tools, an enterprise HR platform, a Rust/Wasm emulator, and production websites. Hover a card to see the real thing.'
};

export interface Project {
	id: string;
	title: string;
	summary: string;
	tags: string[];

	link?: string;

	award?: string;

	press?: { label: string; href: string }[];
}

export const projects: Project[] = [
	{
		id: 'ascii-renderer',
		title: 'azur-ascii-renderer',
		summary:
			'A standalone package I wrote for this site. It bakes a glyph atlas once, then tiles a phrase across a grid of cells, each one a blit from that atlas tinted to its brightness, so a brightness bitmap can light up a region of the field (the hand). A seeded PRNG drives the flicker, and a hover void and a click band layer on top. The canvas is DPI-aware and frame-capped, and the output is deterministic and unit-tested. The field you are looking at is its output.',
		tags: ['TypeScript', 'Canvas 2D', 'Glyph Atlas', 'Standalone Package'],
		link: 'https://github.com/Azur1337/ascii-renderer'
	},
	{
		id: 'gfos2024',
		title: 'Workwatch',
		summary:
			'Built with two teammates for the GFOS Innovationsaward. I owned the SvelteKit front end: real-time attendance over WebSockets, class management, and a reporting layer that aggregates a full term of attendance data into per-class and per-student views. The Java/PostgreSQL backend was split across the team. Built for the competition, so it never took real users.',
		tags: ['SvelteKit', 'TypeScript', 'Tailwind CSS', 'Java', 'PostgreSQL', 'Docker'],
		award: '1st Place · GFOS Innovationsaward 2024',
		press: [
			{
				label: 'Radio Essen',
				href: 'https://www.radioessen.de/artikel/junge-it-talente-aus-essen-ausgezeichnet-2030508'
			},
			{
				label: 'HNBK',
				href: 'https://hnbk.de/index.php/hbfs-schueler-gewinnen-gfos-innovations-award/'
			}
		],
		link: 'https://gfos24.0x187.dev/'
	},
	{
		id: 'hrtime',
		title: 'HRTime Online - Enterprise HR Time & Leave Platform',
		summary:
			'A legacy .NET 6 HR monolith (time tracking, leave approval, shift planning) rebuilt on .NET 10 / Blazor Server. I rebuilt the front end as a reusable MudBlazor + Tailwind component architecture, added cookie-based auth with digital-signature capture and full DE/EN localization, and tuned performance: Brotli/Gzip compression, static-asset caching, and health checks, served through IIS with WebSockets/SignalR for real-time data. This one is in production, serving thousands of users.',
		tags: ['.NET 10', 'Blazor Server', 'C#', 'MudBlazor', 'Tailwind CSS', 'IIS']
	},
	{
		id: 'gfos2025',
		title: 'Worksale',
		summary:
			'The 2024 attendance solution, rebuilt with one teammate for the 2025 award. I reworked the SvelteKit front end and the data flow between it and the Java/PostgreSQL backend, tightening the architecture so the reporting and real-time views share one source of truth. 2nd place. Like the 2024 build, it was made for the competition and never went public.',
		tags: ['SvelteKit', 'TypeScript', 'Tailwind CSS', 'Java', 'PostgreSQL', 'Docker'],
		award: '2nd Place · GFOS Innovationsaward 2025',
		link: 'https://gfos25.0x187.dev/'
	},
	{
		id: 'ruhrpott',
		title: 'Ruhrpottmetaller',
		summary:
			'Designed and built the corporate site for a German metal-recycling company, from Figma to production. I handled the design system, the responsive layout, the custom animations, and the SEO work (semantic markup, meta, and Core Web Vitals). A client project, so the bar was a fast, accessible site that ranks, not a systems challenge.',
		tags: ['Design', 'Development', 'SEO'],
		link: 'https://ruhrpottmetall.de/'
	},
	{
		id: 'chip8',
		title: 'Chip-8 Emulator',
		summary:
			'A Chip-8 emulator written in Rust and compiled to WebAssembly, so the whole CPU runs in the browser. I implemented the instruction set for cycle-accurate emulation, a retro-styled debugger that steps and inspects registers and memory, and a Svelte front end with game presets. The hard part was keeping the Rust core deterministic and fast enough to feel like a real console.',
		tags: ['Rust', 'WebAssembly', 'Svelte', 'TypeScript'],
		link: 'https://chip8.0x187.dev/'
	},
	{
		id: 'fileconv',
		title: 'FileConv',
		summary:
			'A browser-based multimedia toolkit that runs FFmpeg via WebAssembly, so video, audio, images, subtitles, and streams can be converted, compressed, and have their metadata edited without installing anything or sending files to a server. The hard part was taming FFmpeg in the browser: wiring up the WASM build, streaming large files through it without blowing memory, and surfacing progress and errors in a way that does not feel like a black box.',
		tags: ['FFmpeg', 'WebAssembly', 'TypeScript'],
		link: 'https://fileconv.0x187.dev/'
	}
];
