<script lang="ts">
	interface Props {
		dir: boolean;

		open?: boolean;

		name?: string;
	}

	let { dir, open = false, name = '' }: Props = $props();

	const svg = 'size-10 shrink-0';

	const fileKind = $derived.by(() => {
		const ext = name.split('.').pop() ?? '';
		if (ext === 'html') return 'html';
		if (ext === 'json') return 'json';
		if (ext === 'md') return 'md';
		if (ext === 'css') return 'css';
		if (ext === 'ts') return 'ts';
		return 'file';
	});
</script>

{#if dir}
	<span class="flex items-center gap-6">
		<svg
			aria-hidden="true"
			class={svg}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			{#if open}<path d="m6 9 6 6 6-6" />{:else}<path d="m9 18 6-6-6-6" />{/if}
		</svg>
		<svg
			aria-hidden="true"
			class={svg}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path
				d="M4 20a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4.3a2 2 0 0 1 1.5.7L11 6h9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2z"
			/>
		</svg>
	</span>
{:else}
	<svg
		aria-hidden="true"
		class={svg}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		{#if fileKind === 'html'}
			<polyline points="16 18 22 12 16 6" />
			<polyline points="8 6 2 12 8 18" />
		{:else if fileKind === 'json'}
			<path
				d="M12.33 2.88h.34a2 2 0 0 1 2 2v2.03c0 1.08.87 1.95 1.95 1.95h.38a2 2 0 0 1 2 2v1.42a2 2 0 0 1-2 2h-.38c-1.08 0-1.95.87-1.95 1.95v2.02a2 2 0 0 1-2 2h-.34"
			/>
			<path
				d="M11.67 2.88h-.34a2 2 0 0 0-2 2v2.03c0 1.08-.87 1.95-1.95 1.95H7a2 2 0 0 0-2 2v1.42a2 2 0 0 0 2 2h.38c1.08 0 1.95.87 1.95 1.95v2.02a2 2 0 0 0 2 2h.34"
			/>
		{:else if fileKind === 'md'}
			<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
			<polyline points="14 2 14 8 20 8" />
			<path d="M16 13H8" />
			<path d="M16 17H8" />
			<path d="M10 9H8" />
		{:else if fileKind === 'css'}
			<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
			<polyline points="14 2 14 8 20 8" />
			<path d="m8 13-2 2 2 2" />
			<path d="m16 13 2 2-2 2" />
			<path d="m11 17 2-6" />
		{:else if fileKind === 'ts'}
			<rect x="2" y="2" width="20" height="20" rx="2.5" fill="currentColor" stroke="none" />
			<text
				x="12"
				y="16.5"
				text-anchor="middle"
				font-family="var(--font-sans)"
				font-size="11"
				font-weight="700"
				fill="var(--color-black-deep)"
				stroke="none">TS</text
			>
		{:else}
			<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
			<polyline points="14 2 14 8 20 8" />
		{/if}
	</svg>
{/if}
