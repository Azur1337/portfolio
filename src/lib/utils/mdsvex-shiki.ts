import { getSingletonHighlighter, type Highlighter } from 'shiki';

let highlighter: Highlighter | null = null;

async function getHighlighterInstance(): Promise<Highlighter> {
	if (!highlighter) {
		highlighter = await getSingletonHighlighter({
			themes: ['one-dark-pro'],
			langs: [
				'rust',
				'bash',
				'sh',
				'javascript',
				'typescript',
				'json',
				'yaml',
				'toml',
				'markdown',
				'html',
				'css',
				'svelte',
				'python',
				'go',
				'c',
				'cpp',
				'sql'
			]
		});
	}
	return highlighter;
}

export async function highlightCode(code: string, lang: string): Promise<string> {
	const instance = await getHighlighterInstance();
	try {
		return instance.codeToHtml(code, { lang, theme: 'one-dark-pro' });
	} catch (e) {
		console.warn(`Failed to highlight code block (lang: ${lang}): ${e}`);
		return `<pre><code>${code}</code></pre>`;
	}
}
