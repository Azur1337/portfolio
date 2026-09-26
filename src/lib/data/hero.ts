export interface HeroCta {
	first: string;

	second: string;
}

export const hero = {
	eyebrow: 'Fullstack Engineer · Web & Systems · UI/UX',

	subtext:
		'Student software engineer based in Bochum, Germany. I build high-performance web apps and system tools. SvelteKit on top, Rust underneath, Linux holding it together.',

	cta: {
		first: 'View',
		second: 'my CV'
	} satisfies HeroCta,

	stats: ['RUST', 'SVELTEKIT', 'POSTGRES', 'AWS', 'DOCKER', 'TYPESCRIPT', 'LINUX', 'SQL']
};
