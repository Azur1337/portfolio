// Parse a Lighthouse JSON report (mobile, performance-only) and print the
// metrics we track against the documented baselines.
// Usage: bun scripts/lh-report.ts [path/to/lh-mobile.json]
const path = process.argv[2] ?? 'lh-mobile.json';
const data = await Bun.file(path).json();

const audits = data.audits;
const num = (id: string) => audits[id]?.numericValue;
const disp = (id: string) => audits[id]?.displayValue ?? 'n/a';

console.log('=== Performance score ===');
console.log((data.categories.performance.score * 100).toFixed(0));

console.log('\n=== Metrics ===');
for (const [id, label] of [
	['first-contentful-paint', 'FCP'],
	['largest-contentful-paint', 'LCP'],
	['total-blocking-time', 'TBT'],
	['cumulative-layout-shift', 'CLS'],
	['speed-index', 'SI']
] as const) {
	console.log(`${label}: ${disp(id)} (numeric ${num(id)?.toFixed?.(1) ?? num(id)})`);
}

console.log('\n=== LCP element ===');
const lcpEl = audits['largest-contentful-paint-element'];
const elItems = lcpEl?.details?.items ?? [];
// LH13 exposes the LCP node + phases via lcp-breakdown-insight; fall back to
// it when the legacy largest-contentful-paint-element audit has no node
const breakdown = audits['lcp-breakdown-insight']?.details?.items ?? [];
const node =
	elItems[0]?.details?.items?.[0]?.node ??
	elItems[0]?.node ??
	breakdown.find((i: { node?: unknown }) => i?.node)?.node;
console.log('element:', node?.selector ?? node?.snippet ?? 'n/a');
const phases = elItems[1]?.details?.items ?? elItems[1]?.items ?? [];
for (const p of phases) {
	const label = p.phase?.label ?? p.label;
	const timing = p.timing ?? p.numericValue;
	const pct = p.percent;
	if (label != null)
		console.log(
			`  ${label}: ${timing?.toFixed?.(1) ?? timing} ms${pct != null ? ` (${(pct * 100).toFixed(0)}%)` : ''}`
		);
}
const lcpBp = audits['lcp-breakdown-property'];
if (lcpBp?.details?.items?.length) {
	console.log('  (lcp-breakdown-property present)');
}

console.log('\n=== Bootup time, top 5 (scripting ms) ===');
const boot = [...(audits['bootup-time']?.details?.items ?? [])]
	.sort((a, b) => (b.total ?? 0) - (a.total ?? 0))
	.slice(0, 5);
for (const r of boot) {
	const url = String(r.url)
		.replace(/^https?:\/\/localhost:4173/, '')
		.slice(0, 80);
	console.log(
		`  ${r.total?.toFixed?.(0)} ms total / ${r.scripting?.toFixed?.(0)} ms scripting  ${url}`
	);
}

console.log('\n=== Long tasks ===');
const lt = audits['long-tasks'];
const ltItems = lt?.details?.items ?? [];
console.log(`count: ${lt?.numericValue ?? ltItems.length}, display: ${disp('long-tasks')}`);
const maxDur = ltItems.reduce(
	(m: number, r: { duration?: number }) => Math.max(m, r.duration ?? 0),
	0
);
console.log(`max duration: ${maxDur.toFixed?.(0) ?? maxDur} ms`);
for (const r of ltItems.slice(0, 5))
	console.log(
		`  ${r.duration?.toFixed?.(0)} ms @ ${r.startTime?.toFixed?.(0)} ms  ${String(r.url)
			.replace(/^https?:\/\/localhost:4173/, '')
			.slice(0, 70)}`
	);

console.log('\n=== Total byte weight ===');
console.log(disp('total-byte-weight'), `(numeric ${num('total-byte-weight')})`);
const tbwItems = audits['total-byte-weight']?.details?.items ?? [];
for (const r of tbwItems.slice(0, 5))
	console.log(
		`  ${(r.totalBytes / 1024).toFixed(1)} KiB  ${String(r.url)
			.replace(/^https?:\/\/localhost:4173/, '')
			.slice(0, 80)}`
	);
