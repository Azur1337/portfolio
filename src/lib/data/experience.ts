import dataflowLogo from '$lib/assets/logos/dataflow_security_logo.jpg';
import microstarLogo from '$lib/assets/logos/microstar_software_gmbh_logo.jpg';
import gfosLogo from '$lib/assets/logos/gfos_mbh_logo.jpg';

export interface ExperienceEntry {
	company: string;
	role: string;

	employmentType?: string;

	period: string;

	duration?: string;
	location?: string;

	workMode?: string;

	highlights: string[];

	skills: string[];

	logo?: string;

	website?: string;
}

export const experience: ExperienceEntry[] = [
	{
		company: 'Dataflow Security SpA',
		role: 'Software Developer, R&D',
		employmentType: 'Part-time',
		period: 'Apr 2026 - Sep 2026',
		duration: '6 mos',
		location: 'Bassano del Grappa, IT',
		workMode: 'Remote',
		highlights: [
			'Built and evolved a local, Docker-based dev environment mirroring production infrastructure, enabling faster feature iteration.',
			'Designed, developed, and rolled out an internal project-management application on Rust and React, used by the ~130-person R&D team.',
			'Built a local search engine for an internal Matrix-protocol comms system, combining several open-source Rust libraries into an optimized whole.',
			'Designed and developed an authentication layer for internal R&D services as a Rust backend on AWS, securing tools for a government-facing cybersecurity provider.',
			'Worked in a three-person web team (with a lead and another dev) and day-to-day with researchers across Android, iOS, and browser, so the tools I built had to hold up against people who break things for a living.',
			'Researched installing a Debian-based Linux distribution on Android smartphones.'
		],
		skills: ['Rust', 'React', 'AWS', 'Docker', 'Matrix'],
		logo: dataflowLogo,
		website: 'https://dfsec.com/'
	},
	{
		company: 'HRTime Software GmbH',
		role: 'Full Stack Developer',
		employmentType: 'Work Study',
		period: 'Sep 2025 - Apr 2026',
		duration: '8 mos',
		location: 'Essen, Germany',
		workMode: 'On-site',
		highlights: [
			'Migrated a legacy .NET 6 monolith to a modern .NET 10 / Blazor Server microservice architecture serving thousands of users.',
			'Rebuilt the frontend as a reusable MudBlazor + Tailwind component architecture for maintainability and performance.',
			'Implemented cookie-based authentication with digital signature capture and full DE/EN localization.',
			'Owned Windows Server IIS infrastructure: in-process hosting, SSL, and WebSockets/SignalR for real-time data.',
			'Tuned performance and reliability (Brotli/Gzip compression, static-asset caching, health checks), delivered via CI/CD.'
		],
		skills: ['Blazor', 'C#', '.NET 10', 'MudBlazor', 'IIS', 'SignalR', 'i18n', 'CI/CD'],
		logo: microstarLogo,
		website: 'https://www.hrtime.de'
	},
	{
		company: 'HRTime Software GmbH',
		role: 'Software Developer',
		employmentType: 'Internship',
		period: 'Jun 2025 - Jul 2025',
		duration: '2 mos',
		location: 'Essen, Germany',
		workMode: 'On-site',
		highlights: [
			'Executed a complete UI/UX redesign of the core web application, improving user experience and accessibility.',
			'Optimized frontend performance by refactoring legacy code into reusable components.'
		],
		skills: ['Blazor', 'C#', 'UI/UX', 'TypeScript'],
		logo: microstarLogo,
		website: 'https://www.hrtime.de'
	},
	{
		company: 'GFOS mbH',
		role: 'Software Developer',
		employmentType: 'Internship',
		period: 'May 2024 - Jun 2024',
		duration: '2 mos',
		location: 'Essen, Germany',
		workMode: 'On-site',
		highlights: [
			'Designed and developed a scalable management system with robust database integration.',
			'Implemented data modeling for resource allocation with complex constraints and entity relationships.',
			'Built backend logic and database connectivity using industry-standard tools and practices.',
			'Gained hands-on experience in full-cycle development within a professional software environment.'
		],
		skills: ['Java', 'JDBC', 'SQL', 'Backend'],
		logo: gfosLogo,
		website: 'https://www.gfos.com/en/'
	}
];
