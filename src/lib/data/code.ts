import glyphFieldSrc from '../../../packages/ascii-renderer/src/glyph-field.ts?raw';

export const glyphFieldPath = 'packages/ascii-renderer/src/glyph-field.ts';

const raw = import.meta.glob<string>(
	[
		'../../../packages/ascii-renderer/src/**/*.ts',
		'../../../packages/ascii-renderer/tests/**/*.ts',
		'../../../packages/ascii-renderer/assets/*.ts',
		'../../../packages/ascii-renderer/demo/*.{ts,html}',
		'../../../packages/ascii-renderer/{package.json,tsconfig.json,vite.config.ts,README.md,HANDOFF.md}'
	],
	{ query: '?raw', import: 'default' }
);

export const loaders: Record<string, () => Promise<string>> = {};
for (const [key, load] of Object.entries(raw)) {
	loaders[key.replace('../../../', '')] = load;
}

export type TreeEntry = {
	path: string;

	name: string;

	depth: number;
	dir: boolean;
};

type Node = { name: string; path: string; dir: boolean; children: Map<string, Node> };

const root: Node = { name: '', path: '', dir: true, children: new Map() };
for (const path of Object.keys(loaders).sort()) {
	let node = root;
	const parts = path.split('/');
	parts.forEach((part, i) => {
		const isFile = i === parts.length - 1;
		let child = node.children.get(part);
		if (!child) {
			child = {
				name: part,
				path: parts.slice(0, i + 1).join('/'),
				dir: !isFile,
				children: new Map()
			};
			node.children.set(part, child);
		}
		node = child;
	});
}

export const tree: TreeEntry[] = [];

const pkg = root.children.get('packages')?.children.get('ascii-renderer');
if (pkg) {
	tree.push({ name: pkg.name, path: pkg.path, depth: 0, dir: true });
	(function walk(node: Node, depth: number) {
		const kids = [...node.children.values()].sort((a, b) =>
			a.dir === b.dir ? a.name.localeCompare(b.name) : a.dir ? -1 : 1
		);
		for (const k of kids) {
			tree.push({ name: k.name, path: k.path, depth, dir: k.dir });
			if (k.dir) walk(k, depth + 1);
		}
	})(pkg, 1);
}

export const glyphFieldLines = glyphFieldSrc.split('\n');

export const markers = {
	constructor: glyphFieldLines.findIndex((l) => l.startsWith('\tconstructor(')),
	highlight: glyphFieldLines.findIndex((l) => l.includes('the hand fills the right half')),
	cursor: glyphFieldLines.findIndex((l) => l.includes('mulberry32(0x187)'))
};

export const code = {
	eyebrow: 'The code',

	title: 'This is the actual repo.',

	subtext:
		'The hand above is not an image. It is azur-ascii-renderer, a standalone package I wrote: it bakes a glyph atlas once, tiles a phrase across a grid of cells, and tints each cell from a brightness bitmap so a region of the field lights up. A seeded PRNG drives the flicker, and a hover void and a click band layer on top. The canvas is DPI-aware and frame-capped, and the output is deterministic and unit-tested. See for yourself.',

	cta: { label: 'read the rest', href: 'https://github.com/Azur1337/ascii-renderer' }
};
