<script lang="ts">
	import { onMount } from 'svelte';
	import FileIcon from '$lib/components/FileIcon.svelte';
	import { glyphFieldLines, glyphFieldPath, loaders, markers, tree } from '$lib/data/code';

	type Tok = { text: string; cls: string };

	const KEYWORDS = new Set([
		'import',
		'from',
		'export',
		'const',
		'let',
		'var',
		'new',
		'return',
		'if',
		'else',
		'throw',
		'class',
		'interface',
		'type',
		'null',
		'undefined',
		'this',
		'private',
		'public',
		'extends',
		'implements',
		'typeof',
		'number',
		'string',
		'boolean',
		'void',
		'as',
		'in',
		'of'
	]);

	const LINE_COMMENT = /^\s*(\/\/|\*|\/\*|#)/;

	const TOKEN =
		/('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`?)|(\/\/.*)|(\/\*.*?\*\/|\/\*.*$)|\b(0x[0-9a-fA-F]+|\d+(?:\.\d+)?)\b|\.([A-Za-z_$][\w$]*)|([A-Za-z_$][\w$]*)(?=\s*\()|\b([A-Za-z_$][\w$]*)\b/g;

	function tokenize(line: string): Tok[] {
		if (LINE_COMMENT.test(line)) return [{ text: line, cls: 'cmt' }];
		const out: Tok[] = [];
		let last = 0;
		for (const m of line.matchAll(TOKEN)) {
			const i = m.index ?? 0;
			if (i > last) out.push({ text: line.slice(last, i), cls: '' });
			const [full, str, lineCmt, blockCmt, num, prop, fn, ident] = m;
			if (prop) {
				out.push({ text: '.', cls: '' }, { text: prop, cls: 'prop' });
			} else if (str) out.push({ text: full, cls: 'str' });
			else if (lineCmt || blockCmt) out.push({ text: full, cls: 'cmt' });
			else if (num) out.push({ text: full, cls: 'num' });
			else if (fn)
				out.push({
					text: full,
					cls: KEYWORDS.has(fn) ? 'kw' : /^[A-Z]/.test(fn) ? 'cls' : 'fn'
				});
			else if (ident)
				out.push({
					text: full,
					cls: KEYWORDS.has(ident) ? 'kw' : /^[A-Z]/.test(ident) ? 'cls' : ''
				});
			last = i + full.length;
		}
		if (last < line.length) out.push({ text: line.slice(last), cls: '' });
		return out;
	}

	let tabs = $state<string[]>([glyphFieldPath]);
	let active = $state(glyphFieldPath);

	let contents = $state<Record<string, string[]>>({ [glyphFieldPath]: glyphFieldLines });
	let loading = $state<Record<string, boolean>>({});

	let collapsed = $state<Record<string, boolean>>({});

	const tokenCache: Record<string, Tok[][]> = {};
	function tokensFor(path: string): Tok[][] {
		const src = contents[path];

		if (!src) return [];
		let t = tokenCache[path];
		if (!t) {
			t = src.map(tokenize);
			tokenCache[path] = t;
		}
		return t;
	}

	const rendered = $derived(tokensFor(active));
	const lines = $derived(contents[active] ?? []);
	const isGlyphField = $derived(active === glyphFieldPath);

	const isHi = (i: number) =>
		isGlyphField && (i === markers.highlight || i === markers.highlight + 1);
	const cursorLine = $derived(isGlyphField ? markers.cursor : -1);

	const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

	const codeHtml = $derived(
		rendered
			.map((toks, i) => {
				const hi = isHi(i);
				const anchor = isGlyphField && i === markers.constructor ? ' data-anchor' : '';
				const body = toks
					.map((t) => (t.cls ? `<span class="${t.cls}">${esc(t.text)}</span>` : esc(t.text)))
					.join('');
				const cur =
					i === cursorLine
						? '<span aria-hidden="true" class="animate-cursor-blink text-accent">▍</span>'
						: '';
				return `<div class="flex px-8${hi ? ' bg-white/5' : ''}"${anchor}><span class="w-48 shrink-0 pr-16 text-right text-white/25 select-none${hi ? ' text-accent' : ''}">${i + 1}</span><span class="whitespace-pre">${body}${cur}</span></div>`;
			})
			.join('')
	);

	const visibleTree = $derived(
		tree.filter((row) => {
			const ancestors = row.path.split('/').slice(0, -1);
			return ancestors.every((_, i) => !collapsed[ancestors.slice(0, i + 1).join('/')]);
		})
	);

	const minimap = $derived.by(() => {
		const n = lines.length;
		if (!n) return [];
		const step = Math.max(1, Math.ceil(n / 150));
		const bars: { w: number; faint: boolean }[] = [];
		for (let i = 0; i < n; i += step) {
			const t = lines[i].trim();
			bars.push({
				w: Math.max(6, Math.min(100, (t.length / 90) * 100)),
				faint: t === '' || LINE_COMMENT.test(lines[i])
			});
		}
		return bars;
	});

	const fileCount = $derived(tree.filter((r) => !r.dir).length);
	const fileName = $derived(active.split('/').pop() ?? '');
	const ext = $derived(fileName.split('.').pop() ?? '');
	const lang = $derived(
		(
			{
				ts: 'TypeScript',
				js: 'JavaScript',
				svelte: 'Svelte',
				css: 'CSS',
				html: 'HTML',
				json: 'JSON',
				md: 'Markdown',
				sh: 'Shell',
				yml: 'YAML',
				txt: 'Plain Text'
			} as Record<string, string>
		)[ext] ?? 'Plain Text'
	);

	const termCwd = '~/ascii-renderer';
	const termLines = [
		{ cmd: 'npm i azur-ascii-renderer', note: '# MIT · open source' },
		{ cmd: 'try: cat glyph-field.ts · ls src · git log', note: '' }
	];

	let terminalOpen = $state(true);
	let searchOpen = $state(false);
	let query = $state('');
	let activeIdx = $state(0);
	let searchInput = $state<HTMLInputElement | undefined>();

	const results = $derived(
		tree
			.filter((r) => !r.dir && r.path.toLowerCase().includes(query.trim().toLowerCase()))
			.slice(0, 60)
	);

	$effect(() => {
		if (searchOpen) requestAnimationFrame(() => searchInput?.focus());
	});

	function toggleSearch() {
		searchOpen = !searchOpen;
		if (searchOpen) {
			query = '';
			activeIdx = 0;
		}
	}
	function closeSearch() {
		searchOpen = false;
		query = '';
	}
	function selectFile(path: string) {
		openFile(path);
		closeSearch();
	}

	function paletteKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			activeIdx = Math.min(results.length - 1, activeIdx + 1);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			activeIdx = Math.max(0, activeIdx - 1);
		} else if (e.key === 'Enter') {
			e.preventDefault();
			const r = results[activeIdx];
			if (r) selectFile(r.path);
		} else if (e.key === 'Escape') {
			e.preventDefault();
			closeSearch();
		}
	}

	function onGlobalKey(e: KeyboardEvent) {
		const t = e.target as HTMLElement | null;
		const typing =
			!!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
		const mod = e.ctrlKey || e.metaKey;
		const k = e.key.toLowerCase();
		if (mod && k === 'k') {
			e.preventDefault();
			toggleSearch();
		} else if (mod && k === 'j' && !typing) {
			e.preventDefault();
			terminalOpen = !terminalOpen;
		} else if (e.key === 'Escape' && searchOpen) {
			closeSearch();
		}
	}

	function toggleDir(path: string) {
		collapsed[path] = !collapsed[path];
	}

	function openFile(path: string) {
		if (!tabs.includes(path)) tabs = [...tabs, path];
		active = path;
		if (!contents[path]) void loadFile(path);
	}

	function closeTab(path: string) {
		const idx = tabs.indexOf(path);
		if (idx === -1) return;
		tabs = tabs.filter((t) => t !== path);
		if (active === path) {
			const next = tabs[Math.min(idx, tabs.length - 1)];
			active = next ?? '';
			if (next && !contents[next]) void loadFile(next);
		}
	}

	async function loadFile(path: string) {
		loading[path] = true;
		try {
			const src = await loaders[path]();
			contents[path] = src.split('\n');
		} finally {
			loading[path] = false;
		}
	}

	let paneEl: HTMLDivElement | undefined;
	$effect(() => {
		const pane = paneEl;
		if (!pane || !isGlyphField) return;
		requestAnimationFrame(() => {
			const anchor = pane.querySelector<HTMLElement>('[data-anchor]');
			if (anchor) pane.scrollTop = anchor.offsetTop - 24;
		});
	});

	let minimapEl: HTMLDivElement | undefined;
	let viewTop = $state(0);
	let viewFrac = $state(1);
	let mmDragging = $state(false);

	function updateScroll() {
		const p = paneEl;
		if (!p) return;
		const sh = p.scrollHeight;
		viewTop = sh ? p.scrollTop / sh : 0;
		viewFrac = sh ? Math.min(1, p.clientHeight / sh) : 1;
	}

	function minimapNav(e: PointerEvent) {
		const m = minimapEl;
		const p = paneEl;
		if (!m || !p) return;
		const r = m.getBoundingClientRect();
		const f = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
		p.scrollTop = f * (p.scrollHeight - p.clientHeight);
	}

	function minimapDown(e: PointerEvent) {
		mmDragging = true;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		minimapNav(e);
	}
	function minimapMove(e: PointerEvent) {
		if (mmDragging) minimapNav(e);
	}
	function minimapUp() {
		mmDragging = false;
	}

	let treeWidth = $state(260);
	let termHeight = $state(60);

	function startDrag(kind: 'tree' | 'term', e: PointerEvent) {
		e.preventDefault();
		const target = e.currentTarget as HTMLElement;
		target.setPointerCapture(e.pointerId);
		const startPos = kind === 'tree' ? e.clientX : e.clientY;
		const startSize = kind === 'tree' ? treeWidth : termHeight;
		const move = (ev: PointerEvent) => {
			const d = (kind === 'tree' ? ev.clientX : ev.clientY) - startPos;
			if (kind === 'tree') treeWidth = Math.min(480, Math.max(160, startSize + d));
			else termHeight = Math.min(400, Math.max(40, startSize - d));
		};
		const up = () => {
			target.removeEventListener('pointermove', move);
			target.removeEventListener('pointerup', up);
			target.removeEventListener('pointercancel', up);
		};
		target.addEventListener('pointermove', move);
		target.addEventListener('pointerup', up);
		target.addEventListener('pointercancel', up);
	}

	$effect(() => {
		void [treeWidth, termHeight];
		requestAnimationFrame(updateScroll);
	});

	onMount(() => {
		window.addEventListener('keydown', onGlobalKey);
		requestAnimationFrame(updateScroll);
		return () => window.removeEventListener('keydown', onGlobalKey);
	});
</script>

<div class="carbon">
	<div class="rounded-6 relative overflow-hidden bg-black text-white ring-1 ring-white/10">
		<div class="relative flex items-stretch gap-2 border-b border-white/5 bg-white/[0.02] px-8">
			{#each tabs as tab (tab)}
				<div
					class="group my-6 flex items-center rounded-4 {tab === active
						? 'bg-white/10 text-white'
						: 'text-dark-grey hover:text-white/70'}"
					title={tab}
					onauxclick={(e) => {
						if (e.button === 1) closeTab(tab);
					}}
				>
					<button
						type="button"
						class="py-6 pr-2 pl-14 font-mono text-caption-20 uppercase"
						onclick={() => openFile(tab)}
					>
						{tab.split('/').pop()}
					</button>
					<button
						type="button"
						aria-label="Close {tab.split('/').pop()}"
						class="rounded-3 mr-4 p-3 transition-opacity hover:bg-white/10 {tab === active
							? 'opacity-50 hover:opacity-100'
							: 'opacity-0 group-hover:opacity-60 focus-visible:opacity-100'}"
						onclick={() => closeTab(tab)}
					>
						<svg
							aria-hidden="true"
							class="size-14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg
						>
					</button>
				</div>
			{/each}
			<span
				class="pointer-events-none absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 font-mono text-body-20 tracking-[0.2em] text-white/40 uppercase lg:block"
			>
				This is the actual repo.
			</span>
			<div class="ml-auto flex items-center gap-8 pr-8">
				<button
					type="button"
					onclick={() => (terminalOpen = !terminalOpen)}
					class="hidden items-center gap-6 rounded-4 border px-8 py-4 font-mono text-caption-20 sm:flex {terminalOpen
						? 'border-white/20 text-white/70'
						: 'border-white/10 text-white/40 hover:text-white/60'}"
				>
					<svg
						aria-hidden="true"
						class="size-10"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						><rect width="18" height="18" x="3" y="3" rx="2" /><path d="m7 11 2-2-2-2" /><path
							d="M11 13h4"
						/></svg
					>
					Ctrl J
				</button>
				<button
					type="button"
					onclick={toggleSearch}
					class="hidden items-center gap-6 rounded-4 border border-white/10 px-8 py-4 font-mono text-caption-20 text-white/40 hover:text-white/60 sm:flex"
				>
					<svg
						aria-hidden="true"
						class="size-10"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg
					>
					Ctrl K
				</button>
			</div>
		</div>

		<div class="flex h-[72vh] min-h-[520px]">
			<aside
				class="hidden shrink-0 overflow-y-auto border-r border-white/5 py-12 pr-8 font-mono text-caption-20 lg:block"
				style="width: {treeWidth}px"
			>
				{#each visibleTree as row (row.path)}
					{#if row.dir}
						<button
							type="button"
							class="flex w-full items-center gap-6 px-8 py-2 text-left text-white/60 uppercase hover:text-white"
							style="padding-left: {8 + row.depth * 14}px"
							onclick={() => toggleDir(row.path)}
						>
							<FileIcon dir open={!collapsed[row.path]} />
							<span class="truncate">{row.name}</span>
						</button>
					{:else}
						<button
							type="button"
							class="flex w-full items-center gap-6 px-8 py-2 text-left {row.path === active
								? 'text-accent'
								: 'text-dark-grey uppercase hover:text-white/70'}"
							style="padding-left: {24 + row.depth * 14}px"
							onclick={() => openFile(row.path)}
						>
							<FileIcon dir={false} name={row.name} />
							<span class="truncate">{row.name}</span>
						</button>
					{/if}
				{/each}
			</aside>

			<div
				class="group relative hidden w-2 shrink-0 cursor-col-resize touch-none lg:block"
				role="separator"
				aria-orientation="vertical"
				aria-label="Resize file tree"
				onpointerdown={(e) => startDrag('tree', e)}
			>
				<div
					class="absolute inset-x-[-4px] inset-y-0 transition-colors group-hover:bg-accent/50"
				></div>
			</div>

			<div class="flex min-w-0 grow flex-col">
				<div
					class="flex items-center gap-8 border-b border-white/5 px-16 py-8 font-mono text-caption-20 text-white/50 uppercase"
				>
					<span>{fileName}</span>
					<span class="ml-auto text-white/25 normal-case">{lang}</span>
				</div>

				<div class="flex min-h-0 grow">
					<div
						class="relative min-w-0 grow overflow-auto bg-[#181818]"
						bind:this={paneEl}
						onscroll={updateScroll}
					>
						{#if !active}
							<p class="px-16 py-16 font-mono text-caption-20 text-dark-grey">
								// no file open - pick one from the tree (Ctrl K to search)
							</p>
						{:else if loading[active]}
							<p class="px-16 py-16 font-mono text-caption-20 text-dark-grey">
								// loading {active}…
							</p>
						{:else}
							<!-- eslint-disable svelte/no-at-html-tags -->
							<pre
								class="code-pane w-max min-w-full py-16 font-mono text-caption-20 leading-[1.5]">{@html codeHtml}</pre>
							<!-- eslint-enable svelte/no-at-html-tags -->
						{/if}
					</div>

					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						class="relative hidden w-44 shrink-0 cursor-pointer overflow-hidden border-l border-white/5 bg-[#181818] lg:block"
						bind:this={minimapEl}
						onpointerdown={minimapDown}
						onpointermove={minimapMove}
						onpointerup={minimapUp}
						onpointercancel={minimapUp}
					>
						<div class="flex flex-col gap-[2px] overflow-hidden py-10 pr-8" aria-hidden="true">
							{#each minimap as bar, bi (bi)}
								<div
									class="h-[2px] rounded-full {bar.faint ? 'bg-white/5' : 'bg-white/20'}"
									style="width: {bar.w}%"
								></div>
							{/each}
						</div>
						<div
							class="pointer-events-none absolute inset-x-0 bg-white/10 ring-1 ring-white/25"
							style="top: {viewTop * 100}%; height: {viewFrac * 100}%"
						></div>
					</div>
				</div>

				{#if terminalOpen}
					<div
						class="group relative h-2 shrink-0 cursor-row-resize touch-none"
						role="separator"
						aria-orientation="horizontal"
						aria-label="Resize terminal"
						onpointerdown={(e) => startDrag('term', e)}
					>
						<div
							class="absolute inset-x-0 inset-y-[-4px] transition-colors group-hover:bg-accent/50"
						></div>
					</div>
					<div class="shrink-0 border-t border-white/5">
						<div
							class="border-b border-white/5 bg-white/[0.02] px-16 py-6 font-mono text-caption-20 tracking-[0.2em] text-white/40 uppercase"
						>
							Terminal
						</div>
						<div
							class="flex flex-col gap-4 overflow-y-auto px-16 py-12 font-mono text-caption-20 whitespace-pre"
							style="height: {termHeight}px"
						>
							{#each termLines as tl (tl.cmd)}
								<p>
									<span class="text-white/30">{termCwd} &gt;</span>
									<span class="text-accent">{tl.cmd}</span>
									{#if tl.note}<span class="text-white/25"> {tl.note}</span>{/if}
								</p>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>

		<div
			class="flex items-center gap-12 border-t border-white/5 bg-white/[0.02] px-16 py-8 font-mono text-caption-20 text-white/40 uppercase"
		>
			<span class="flex items-center gap-6">
				<svg
					aria-hidden="true"
					class="size-10"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					><line x1="6" x2="6" y1="3" y2="15" /><circle cx="18" cy="6" r="3" /><circle
						cx="6"
						cy="18"
						r="3"
					/><path d="M18 9a9 9 0 0 1-9 9" /></svg
				>
				main
			</span>
			<span class="text-white/15">|</span>
			<span class="flex items-center gap-6">
				<span class="size-6 rounded-full bg-accent"></span>
				updated today
			</span>
			<span class="ml-auto flex items-center gap-6">
				<svg
					aria-hidden="true"
					class="size-10"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					><line x1="4" x2="20" y1="9" y2="9" /><line x1="4" x2="20" y1="15" y2="15" /><line
						x1="10"
						x2="8"
						y1="3"
						y2="21"
					/><line x1="16" x2="14" y1="3" y2="21" /></svg
				>
				{fileCount} files
			</span>
		</div>

		{#if searchOpen}
			<button
				type="button"
				class="absolute inset-0 z-10 bg-black-deep/60"
				aria-label="Close search"
				onclick={closeSearch}
			></button>
			<div class="pointer-events-none absolute inset-x-0 top-48 z-20 flex justify-center px-16">
				<div
					class="rounded-6 pointer-events-auto w-full max-w-520 overflow-hidden bg-[#181818] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)] ring-1 ring-white/15"
				>
					<div class="flex items-center gap-10 border-b border-white/10 px-16 py-12">
						<svg
							aria-hidden="true"
							class="size-12 shrink-0 text-white/40"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg
						>
						<input
							bind:this={searchInput}
							bind:value={query}
							oninput={() => (activeIdx = 0)}
							onkeydown={paletteKeydown}
							type="text"
							placeholder="Search files…"
							class="min-w-0 grow bg-transparent font-mono text-caption-20 text-white placeholder:text-white/30 focus:outline-none"
						/>
						<kbd
							class="rounded-4 border border-white/10 px-6 py-2 font-mono text-caption-20 text-white/30"
							>esc</kbd
						>
					</div>
					<ul class="max-h-300 overflow-y-auto py-6 font-mono text-caption-20">
						{#each results as r, ri (r.path)}
							<li>
								<button
									type="button"
									class="flex w-full items-center gap-8 px-16 py-6 text-left {ri === activeIdx
										? 'bg-white/10 text-white'
										: 'text-dark-grey'}"
									onmouseenter={() => (activeIdx = ri)}
									onclick={() => selectFile(r.path)}
								>
									<FileIcon dir={false} name={r.name} />
									<span class="truncate">{r.path}</span>
								</button>
							</li>
						{:else}
							<li class="px-16 py-12 text-dark-grey">No files match “{query}”</li>
						{/each}
					</ul>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.carbon {
		border: 1px solid #000;
		border-radius: calc(var(--spacing) * 8);
		padding: calc(var(--spacing) * 6);
		background-color: var(--color-black-deep);
		background-image: repeating-conic-gradient(
			rgba(255, 255, 255, 0.22) 0%,
			rgba(255, 255, 255, 0.22) 25%,
			transparent 0%,
			transparent 50%
		);
		background-size: 4px 4px;
		box-shadow:
			0 10px 15px -3px rgb(0 0 0 / 0.1),
			0 4px 6px -4px rgb(0 0 0 / 0.1);
	}

	.carbon :global(*) {
		scrollbar-width: thin;
		scrollbar-color: rgba(255, 255, 255, 0.16) transparent;
	}
	.carbon :global(*::-webkit-scrollbar) {
		width: 10px;
		height: 10px;
	}
	.carbon :global(*::-webkit-scrollbar-track) {
		background: transparent;
	}
	.carbon :global(*::-webkit-scrollbar-thumb) {
		background: rgba(255, 255, 255, 0.1);
		border: 3px solid transparent;
		border-radius: 9999px;
		background-clip: content-box;
	}
	.carbon :global(*::-webkit-scrollbar-thumb:hover) {
		background: rgba(255, 255, 255, 0.24);
		background-clip: content-box;
	}
	.carbon :global(*::-webkit-scrollbar-corner) {
		background: transparent;
	}

	.code-pane {
		tab-size: 2;
		color: var(--sh-identifier);
	}
	.code-pane :global(.str) {
		color: var(--sh-string);
	}
	.code-pane :global(.cmt) {
		color: var(--sh-comment);
	}
	.code-pane :global(.num) {
		color: var(--sh-number);
	}
	.code-pane :global(.prop) {
		color: var(--sh-property);
	}
	.code-pane :global(.fn) {
		color: var(--sh-class);
	}
	.code-pane :global(.cls) {
		color: var(--sh-entity);
	}
	.code-pane :global(.kw) {
		color: var(--sh-keyword);
	}
</style>
