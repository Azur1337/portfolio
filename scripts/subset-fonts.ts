/**
 * Build Latin-subset woff2 fonts from the full Geist/Upheaval files in
 * static/fonts/.
 *
 * Why: the two variable Geist files are ~70 KB each. Under Lighthouse's
 * simulated mobile network they arrive ~1 s after first paint, and the
 * tagline's LCP timestamp is re-recorded at that font-swap repaint. A Latin
 * subset keeps every glyph the site can render at roughly half the weight.
 *
 * Run: `bun scripts/subset-fonts.ts` (idempotent; rerun after swapping font
 * files). The originals stay untouched; the app references the .latin files.
 */
import { readFile, writeFile, stat } from 'node:fs/promises';
import subsetFont from 'subset-font';

/**
 * Character set: printable ASCII, Latin-1 (accents + the "·" used across the
 * ASCII fields), general punctuation (curly quotes, dashes, ellipsis),
 * mathematical minus (the nav −/+/× toggle), block + geometric elements (the
 * "▍" cursor, "░▒▓" art, the "□" window control), arrows, and the "✕" close
 * glyph. Kept deliberately a touch wider than the current copy so a small
 * content edit does not immediately drop a needed glyph.
 */
function range(start: number, end: number): string {
	let s = '';
	for (let cp = start; cp <= end; cp++) s += String.fromCodePoint(cp);
	return s;
}
const CHARS =
	range(0x20, 0x7e) +
	range(0xa0, 0xff) +
	range(0x2000, 0x206f) +
	range(0x2190, 0x21ff) +
	range(0x2200, 0x22ff) +
	range(0x2580, 0x25ff) +
	range(0x2700, 0x27bf);

const FILES = ['GeistSans.woff2', 'GeistMono.woff2', 'Upheaval.woff2'];

for (const file of FILES) {
	const src = new URL(`../static/fonts/${file}`, import.meta.url);
	const dest = new URL(
		`../static/fonts/${file.replace('.woff2', '.latin.woff2')}`,
		import.meta.url
	);
	const input = await readFile(src);
	const output = await subsetFont(input, CHARS, { targetFormat: 'woff2' });
	await writeFile(dest, output);
	const before = (await stat(src)).size;
	const after = output.byteLength;
	console.log(
		`${file}: ${(before / 1024).toFixed(1)} KB -> ${(after / 1024).toFixed(1)} KB (${((after / before) * 100).toFixed(0)}%)`
	);
}
