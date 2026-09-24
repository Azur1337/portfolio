export interface FaqItem {
	q: string;

	a: string;
}

export interface Faq {
	title: string[];

	eyebrow: string;

	cta: {
		first: string;
		second: string;
		href: string;
	};

	items: FaqItem[];
}

export const faq: Faq = {
	eyebrow: 'FAQ',
	title: ['Before you', 'hire'],
	cta: {
		first: "Let's",
		second: 'talk',
		href: '#offer'
	},
	items: [
		{
			q: 'Are you available for a student or part-time role?',
			a: 'Yes. I am a full-time B.Sc. Computer Science student at Hochschule Bochum, so I work in blocks that fit around a semester: part-time, freelance, or a capped weekly commitment. I am deliberately not looking for a 40-hour full-time seat right now, and I will tell you up front what I can commit to rather than over-promising and under-delivering.'
		},
		{
			q: 'How many hours a week can you actually commit?',
			a: 'A realistic range is 10 to 20 hours a week, with a hard ceiling during exam weeks. I block my availability in the calendar before we start, so you always know exactly when I am online. If a deadline lands in a crunch week, I flag it early instead of silently slipping.'
		},
		{
			q: 'Do you work remote, and what is your timezone?',
			a: 'Fully remote. I am based in Bochum, Germany (CET, UTC+1 / UTC+2 in summer) and I work across the EU. I overlap comfortably with UK, DACH, and the wider European day, and I am happy to shift a few hours for US East Coast when a role needs it.'
		},
		{
			q: 'Can you work across timezones and in async teams?',
			a: 'Yes. I run my own work asynchronously by default: written specs, recorded walkthroughs, and a clear definition of done on every task. I do not need a standup to make progress, and I am comfortable being the one who writes the documentation the rest of the team reads.'
		},
		{
			q: 'Why do you bridge systems engineering and UI design?',
			a: 'Because the two halves keep each other honest. Systems work teaches me to care about memory, latency, and failure modes; design work teaches me to care about the person on the other side of the interface. I can build the Rust service and the SvelteKit front end that talks to it, and I will not ship a fast system that is painful to use.'
		},
		{
			q: 'Is the systems / design split a distraction or a strength?',
			a: 'A strength, for the right role. It means I can own a feature end to end: the data model, the API contract, the rendering, and the interaction. The trade-off is that I am not a specialist in any single layer, so for a deeply narrow role a specialist may be the better hire. I am the right call when the work spans the stack.'
		},
		{
			q: 'What is your stack, and how deep does it go?',
			a: 'SvelteKit and TypeScript on the front end, Rust and Python on the back end, SQL and AWS for data and infrastructure, and Docker plus Caddy for the plumbing. I am comfortable owning any of these layers, and I reach for the right tool per problem rather than defaulting to one framework.'
		},
		{
			q: 'Do you need a managed environment, or can you set one up?',
			a: 'I can set one up. At Dataflow Security I built a Docker-based local environment that mirrored production, so I am used to standing up the toolchain, the containers, and the CI from a clean machine. Give me the repo and a rough description of the stack and I will have it running locally the same day.'
		},
		{
			q: 'How do you handle code review and pair work?',
			a: 'I write code that is easy to review: small commits, explicit over clever, and a short note on the intent behind each change. I am equally happy to be the reviewer, and I treat a review as a design conversation, not a gate. I have paired and whiteboarded remotely and I am comfortable sharing a screen and thinking out loud.'
		},
		{
			q: 'How do you communicate and report progress?',
			a: 'In writing, by default. I keep a short written log of what I did, what is blocked, and what is next, and I surface risks the moment I see them rather than at the end of the week. I am comfortable in Slack, email, and a video call, and I adapt to whatever the team already uses.'
		},
		{
			q: 'Are you comfortable with security-sensitive or internal tooling?',
			a: 'Yes. My R&D work at Dataflow Security was for a European cybersecurity provider, including an authentication layer for internal services on AWS and a local search engine over an internal Matrix system. I am comfortable with NDAs, least-privilege access, and the discipline of not pushing secrets or PII anywhere they do not belong.'
		},
		{
			q: 'Can you work with an existing codebase, or only greenfield?',
			a: 'Existing codebases are the norm, not the exception. I read the code, find the seams, and make the smallest change that solves the problem before I reach for a refactor. I have migrated enterprise architecture and taken over DevOps workflows at HRTime, so working inside someone else\u2019s system is where I do most of my work.'
		},
		{
			q: 'What do you expect from a team or a manager?',
			a: 'A clear problem, a realistic deadline, and the context to make a call. I do not need to be told how to write the code, but I do need to know what "done" looks like and who I escalate to when a decision is above my pay grade. I am self-directed and I do not need to be managed day to day.'
		},
		{
			q: 'What are your rates, and how do you bill?',
			a: 'For freelance I work on a fixed price per scoped deliverable or a daily rate, agreed before we start, with a written scope so there are no surprises on either side. For a student or part-time role I am open to a salary or a stipend that fits the commitment. I am happy to talk numbers on a call once we know the shape of the work.'
		},
		{
			q: 'How soon can you start, and how long can you commit?',
			a: 'I can start within a couple of weeks, and I am looking for engagements that run for months, not a single sprint. I am not interested in a one-off task that disappears next month; I want work I can build a track record on. If you need someone for a semester or a quarter, that is exactly the shape I am looking for.'
		},
		{
			q: 'What do you need from me to get started?',
			a: 'A short written brief: the problem, the stack, the deadline, and how you like to communicate. From there I will set up the environment, confirm the scope in writing, and send you a first working build within the first week. The fastest way to start is the email in the contact block above.'
		},
		{
			q: 'What should I ask in a first call?',
			a: 'Ask me to walk through one project end to end, from the first commit to the thing that is running in production. Ask me what I would change if I started it again. And ask me what I am not good at, because I will give you a straight answer rather than a polished one. If the call does not feel like a real conversation, that is information too.'
		}
	]
};
