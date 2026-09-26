export interface Principle {
	title: string;
	text: string;
}

export const howIThink = {
	title: 'How I think about\nthe work.',
	intro:
		'Things I keep coming back to, project after project. Not a checklist, just the habits that have saved me from the most bugs. Nine of them, and the hand above is what they add up to.',
	items: [
		{
			title: 'Respect the main thread',
			text: 'The browser gives you about 16 milliseconds a frame, and most of it is already spoken for. I keep the interface lean so that budget goes to the thing the user is actually waiting on, not to a framework doing bookkeeping. It is the first thing I check when something feels slow.'
		},
		{
			title: 'Clean up after yourself',
			text: 'Rust made me think about who frees the memory. I bring that habit to the front end: when a component unmounts, its listeners, timers, and canvas textures go with it. Most of the "why is this getting slower the longer I use it" bugs I have hit were a leak, not a slow algorithm.'
		},
		{
			title: 'One source of truth',
			text: 'The scariest bugs are the ones where the screen and the data disagree. I keep the data layer as the single typed source of truth and treat the UI as a projection of it. When the two can only ever say the same thing, a whole class of visual glitches just stops happening.'
		},
		{
			title: 'Move the heavy work down',
			text: 'JavaScript is great until it is not. When a problem is genuinely heavy, I push it down the stack: the Chip-8 CPU and the FFmpeg pipeline in FileConv both run in Rust or WebAssembly, and the front end stays a thin view on top. The browser should show the result, not grind through it.'
		},
		{
			title: 'Only do what is on screen',
			text: 'Rendering something the user cannot see is just wasted work. I lean on intersection observers and a bit of distance math so the page only calculates what is actually in the viewport. It is a small habit, but on a page with a lot of moving parts it adds up fast.'
		},
		{
			title: 'Motion should feel like mass',
			text: 'I want things to carry momentum, not snap. So scroll and interaction lerp toward their target on a frame-rate independent clock instead of jumping. It is the difference between an interface that feels physical and one that feels like a slideshow.'
		},
		{
			title: 'Keep a semantic shadow',
			text: 'A canvas is useless if a screen reader cannot read it. So the fancy rendering always has a plain, semantic HTML structure behind it that keyboard and assistive tech can navigate. The effect is for the eye; the structure is for everyone else.'
		},
		{
			title: 'Fail early, fail local',
			text: 'A type error I catch in my editor is cheaper than one a user hits in staging. I type the contracts across the stack so a breaking change fails the build on my machine, before a container is ever spun up. I would rather be annoyed at 11pm than have someone else be annoyed at 11am.'
		},
		{
			title: 'Boring is a feature',
			text: 'Code is read far more than it is written, usually by someone who was not in the room when it was written. So I reach for the obvious, explicit version over the clever one. The trickiest line I ever wrote was the one I could not explain to a teammate, and I ended up rewriting it anyway.'
		}
	]
};
