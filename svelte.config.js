import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import { highlightCode } from './src/lib/utils/mdsvex-shiki.ts';

/**
 * mdsvex 0.12.8 still emits the frontmatter `metadata` export as
 * `<script context="module">`, which Svelte 5 deprecates (warning: use the
 * `module` attribute). Wrap mdsvex and rewrite that one attribute in its
 * output, so we don't have to patch the dependency.
 *
 * Svelte 5 preprocessors expose `markup`/`script`/`style` (not a single
 * legacy `preprocess`), so we delegate to `inner.markup` — where the markdown
 * -> Svelte conversion (and the frontmatter script) happens — and leave the
 * other hooks untouched.
 */
function mdsvexSvelte5(options) {
	const inner = mdsvex(options);
	return {
		name: 'mdsvex-svelte5',
		markup: async (args) => {
			const result = await inner.markup(args);
			if (result && typeof result.code === 'string') {
				result.code = result.code.replace('<script context="module">', '<script module>');
			}
			return result;
		},
		...(inner.script ? { script: (args) => inner.script(args) } : {}),
		...(inner.style ? { style: (args) => inner.style(args) } : {})
	};
}

export default {
	// .svx/.md are added for the blog (src/posts/*), compiled by mdsvex
	extensions: ['.svelte', '.svx', '.md'],

	compilerOptions: {
		runes: true
	},

	// vitePreprocess handles <script lang="ts"> in .svelte; mdsvex turns the
	// markdown posts into Svelte components with Shiki-highlighted code.
	preprocess: [
		vitePreprocess(),
		mdsvexSvelte5({
			extensions: ['.svx', '.md'],
			highlight: {
				highlighter: async (code, lang = 'text') => {
					const html = await highlightCode(code, lang);
					// mdsvex expects Svelte source that renders the HTML
					return `{@html \`${html}\`}`;
				}
			}
		})
	],

	kit: {
		adapter: adapter(),
		// inline all component CSS into the initial HTML as <style> tags. Lighthouse
		// flagged the 3 emitted CSS files as render-blocking requests in the
		// critical chain (each ~300ms under mobile throttling); inlining trades
		// ~11KB of extra HTML for zero render-blocking round trips. (This Kit
		// version takes a byte threshold; 64KB covers every style in the app)
		inlineStyleThreshold: 65536,
		alias: {
			// `text-splitter` is a local (unpublished) workspace package; resolve it
			// straight from source so builds and `bun install` never hit the registry
			'text-splitter': './packages/text-splitter/src/index.ts'
		}
	}
};
