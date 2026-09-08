import prettier from 'eslint-config-prettier';
import path from 'node:path';
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import { defineConfig, includeIgnoreFile } from 'eslint/config';
import globals from 'globals';
import ts from 'typescript-eslint';

const gitignorePath = path.resolve(import.meta.dirname, '.gitignore');

export default defineConfig(
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	ts.configs.recommended,
	svelte.configs.recommended,
	prettier,
	svelte.configs.prettier,
	{
		languageOptions: { globals: { ...globals.browser, ...globals.node } },
		rules: {
			// typescript-eslint strongly recommend that you do not use the no-undef lint rule on TypeScript projects.
			// see: https://typescript-eslint.io/troubleshooting/faqs/eslint/#i-get-errors-from-the-no-unused-vars-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
			'no-undef': 'off',
			// Allow intentionally-unused parameters prefixed with `_` (e.g. placeholder APIs).
			'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser
			}
		}
	},
	{
		// Nav.svelte uses in-page hash anchors (#section) that Lenis smooth-scrolls.
		// That is not SvelteKit route navigation, so the resolve() rule is a false
		// positive for this file.
		files: ['src/lib/components/Nav.svelte', 'src/routes/+page.svelte'],
		rules: {
			'svelte/no-navigation-without-resolve': 'off'
		}
	},
	{
		// CvModal.svelte's download link points at a static asset (/resume-*.pdf),
		// not a SvelteKit route, so resolve() does not apply.
		files: ['src/lib/components/CvModal.svelte'],
		rules: {
			'svelte/no-navigation-without-resolve': 'off'
		}
	},
	{
		// These components render external links (GitHub, LinkedIn, press, mailto)
		// with hrefs coming from the data files, and AsciiTransition navigates to
		// an already-resolved URL object. resolve() does not apply to any of them.
		files: [
			'src/lib/components/Faq.svelte',
			'src/lib/components/Footer.svelte',
			'src/lib/components/ProjectCard.svelte',
			'src/lib/components/StatusContact.svelte',
			'src/lib/components/AsciiTransition.svelte'
		],
		rules: {
			'svelte/no-navigation-without-resolve': 'off'
		}
	},
	{
		// Override or add rule settings here, such as:
		// 'svelte/button-has-type': 'error'
		rules: {}
	}
);
