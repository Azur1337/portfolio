export interface StatusLine {
	text: string;
}

export interface Status {
	headline: string[];

	chip: string;

	status: string;

	statusWord: string;

	looking: StatusLine[];

	contactChip: string;

	contactWord: string;

	emailUser: string;
	emailHost: string;

	github: string;

	githubUrl: string;

	linkedin: string;

	linkedinUrl: string;

	blogUrl: string;

	note: string;
}

export const status: Status = {
	headline: ['Computer science student.', 'Open to specific roles.', 'Based in Bochum.'],
	chip: 'STATUS',
	status: 'OPEN TO PART-TIME',
	statusWord: 'AVAILABLE',
	looking: [
		{ text: 'B.SC. COMPUTER SCIENCE, HOCHSCHULE BOCHUM' },
		{ text: 'FULLSTACK & FRONTEND ROLES, WEB + SYSTEMS' },
		{ text: 'PART-TIME & FREELANCE, REMOTE (EU)' }
	],
	contactChip: 'CONTACT',
	contactWord: 'REACH ME',
	emailUser: 'azur',
	emailHost: 'linux.com',
	github: 'Azur1337',
	githubUrl: 'https://github.com/Azur1337',
	linkedin: 'azurdev',
	linkedinUrl: 'https://www.linkedin.com/in/azurdev/',
	blogUrl: '/blog',
	note: 'The fastest way to reach me is email. I reply within a day or two.'
};
