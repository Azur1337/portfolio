export interface Profile {
	name: string;

	legalName: string;
	role: string;
	tagline: string;
	location: string;
	status: string;
	philosophy: string;
	links: {
		portfolio: string;
		linkedin: string;
		github: string | null;
	};
	stack: { label: string; items: string[] }[];
}

export const profile: Profile = {
	name: 'Azur',
	legalName: 'Miguel Cadeddu',
	role: 'Fullstack Engineer (Web & Systems) & UI/UX Designer',
	tagline:
		'Building high-performance web applications & system tools. Specialized in SvelteKit, Rust, and Linux-based infrastructure.',
	location: 'Bochum, Germany (remote)',
	status: 'Available for part-time & freelance',
	philosophy: 'Every pixel matters. Consistency is key. User experience drives business success.',
	links: {
		portfolio: 'https://0x187.dev',
		linkedin: 'https://www.linkedin.com/in/azurdev/',
		github: 'https://github.com/Azur1337'
	},
	stack: [
		{ label: 'Frontend', items: ['SvelteKit', 'TypeScript', 'React', 'Tailwind CSS'] },
		{ label: 'Backend / Systems', items: ['Rust', 'Python', 'SQL', 'AWS'] },
		{ label: 'Infrastructure', items: ['Linux (Arch/Debian)', 'Docker', 'CI/CD', 'Caddy', 'Bash'] },
		{ label: 'Design', items: ['Figma', 'Photoshop', 'UI/UX', 'OKLCH design systems'] },
		{ label: 'Tools', items: ['Neovim', 'Git', 'VS Code'] }
	]
};
