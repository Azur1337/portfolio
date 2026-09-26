<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	type Lang = 'en' | 'de';

	interface Props {
		open: boolean;
	}

	interface ResumeOption {
		value: Lang;
		label: string;
		file: string;

		download: string;
	}

	let { open = false }: Props = $props();

	const dispatch = createEventDispatcher<{ close: void }>();

	const options: ResumeOption[] = [
		{ value: 'en', label: 'EN', file: '/resume-en.pdf', download: 'Miguel-Cadeddu-Resume.pdf' },
		{ value: 'de', label: 'DE', file: '/resume-de.pdf', download: 'Miguel-Cadeddu-Lebenslauf.pdf' }
	];

	let lang = $state<Lang>('en');
	let closeBtn = $state<HTMLButtonElement | undefined>(undefined);
	let lastFocused: HTMLElement | null = null;

	const selected = $derived(options.find((o) => o.value === lang) ?? options[0]);

	function close() {
		dispatch('close');
	}

	function select(value: Lang) {
		lang = value;
	}

	$effect(() => {
		if (open) {
			lastFocused = document.activeElement as HTMLElement | null;

			requestAnimationFrame(() => closeBtn?.focus());
		} else if (lastFocused) {
			lastFocused.focus();
			lastFocused = null;
		}
	});

	function onBackdropKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			e.preventDefault();
			close();
		}
	}
</script>

{#if open}
	<div
		class="backdrop"
		role="dialog"
		aria-modal="true"
		aria-labelledby="cv-modal-title"
		tabindex="-1"
		onclick={(e) => {
			if (e.target === e.currentTarget) close();
		}}
		onkeydown={onBackdropKeydown}
	>
		<div class="carbon">
			<div class="panel">
				<div class="titlebar">
					<span id="cv-modal-title" class="title">cv.pdf - azur@portfolio</span>
					<button
						type="button"
						bind:this={closeBtn}
						class="close"
						aria-label="Close"
						onclick={close}
					>
						<span aria-hidden="true">[x]</span>
					</button>
				</div>

				<div class="tabs" role="tablist" aria-label="Resume language">
					{#each options as option (option.value)}
						<button
							type="button"
							role="tab"
							aria-selected={lang === option.value}
							class="tab"
							class:active={lang === option.value}
							onclick={() => select(option.value)}
						>
							{option.label}
						</button>
					{/each}
					<span class="tabs-hint">choose a language to preview or download</span>
				</div>

				<div class="frame">
					<iframe
						src={`${selected.file}#view=FitH`}
						title={`Resume ${selected.label}`}
						class="pdf"
						loading="lazy"
					></iframe>
				</div>

				<div class="footer">
					<span class="footer-hint">need a copy?</span>
					<a href={selected.file} download={selected.download} class="download">
						<span aria-hidden="true">&darr;</span>
						download {selected.label} pdf
					</a>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		z-index: 100;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: calc(var(--spacing) * 16);
		background: rgb(0 0 0 / 0.7);
	}

	.carbon {
		width: 100%;
		max-width: calc(var(--spacing) * 1280);

		height: calc(100vh - var(--spacing) * 32);
		max-height: calc(100vh - var(--spacing) * 32);
		display: flex;
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
			0 10px 15px -3px rgb(0 0 0 / 0.3),
			0 4px 6px -4px rgb(0 0 0 / 0.3);
	}

	.panel {
		display: flex;
		flex-direction: column;
		flex: 1;
		min-height: 0;
		gap: calc(var(--spacing) * 4);
		padding: calc(var(--spacing) * 4);
		border-radius: calc(var(--spacing) * 2);
		background: var(--color-black);
		box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1);
		font-family: var(--font-mono);
		color: var(--color-white);
	}

	.titlebar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: calc(var(--spacing) * 8);
		padding-bottom: calc(var(--spacing) * 4);
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.title {
		font-size: var(--text-caption-10);
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.4);
	}

	.close {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: calc(var(--spacing) * 2) calc(var(--spacing) * 4);
		border-radius: calc(var(--spacing) * 2);
		background: transparent;
		border: 1px solid rgba(255, 255, 255, 0.2);
		color: rgba(255, 255, 255, 0.6);
		font-family: var(--font-mono);
		font-size: var(--text-caption-10);
		cursor: pointer;
		transition:
			color 0.15s ease,
			border-color 0.15s ease,
			background-color 0.15s ease;
	}
	.close:hover,
	.close:focus-visible {
		color: var(--color-white);
		border-color: rgba(255, 255, 255, 0.5);
		background: rgba(255, 255, 255, 0.06);
	}
	.close:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
	}

	.tabs {
		display: flex;
		align-items: center;
		gap: calc(var(--spacing) * 4);
	}

	.tab {
		padding: calc(var(--spacing) * 3) calc(var(--spacing) * 8);
		border-radius: calc(var(--spacing) * 2);
		border: 1px solid rgba(255, 255, 255, 0.2);
		background: transparent;
		color: rgba(255, 255, 255, 0.6);
		font-family: var(--font-mono);
		font-size: var(--text-caption-10);
		text-transform: uppercase;
		letter-spacing: 0.04em;
		cursor: pointer;
		transition:
			color 0.15s ease,
			border-color 0.15s ease,
			background-color 0.15s ease;
	}
	.tab:hover {
		color: var(--color-white);
		border-color: rgba(255, 255, 255, 0.5);
	}
	.tab.active {
		background: var(--color-accent);
		border-color: var(--color-accent);
		color: var(--color-black-deep);
	}
	.tab:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
	}

	.tabs-hint {
		margin-left: auto;
		font-size: var(--text-caption-10);
		color: rgba(255, 255, 255, 0.35);
	}

	.frame {
		flex: 1;
		min-height: 0;
		border-radius: calc(var(--spacing) * 2);
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.1);
		background: var(--color-off-white);
	}

	.pdf {
		display: block;
		width: 100%;
		height: 100%;
		min-height: calc(var(--spacing) * 640);
		border: 0;
	}

	.footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: calc(var(--spacing) * 8);
		padding-top: calc(var(--spacing) * 4);
		border-top: 1px solid rgba(255, 255, 255, 0.1);
	}

	.footer-hint {
		font-size: var(--text-caption-10);
		color: rgba(255, 255, 255, 0.4);
	}

	.download {
		display: inline-flex;
		align-items: center;
		gap: calc(var(--spacing) * 4);
		padding: calc(var(--spacing) * 4) calc(var(--spacing) * 10);
		border-radius: calc(var(--spacing) * 2);
		background: var(--color-accent);
		color: var(--color-black-deep);
		font-family: var(--font-mono);
		font-size: var(--text-caption-10);
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		text-decoration: none;
		cursor: pointer;
		transition: filter 0.15s ease;
	}
	.download:hover {
		filter: brightness(1.08);
	}
	.download:focus-visible {
		outline: 2px solid var(--color-white);
		outline-offset: 2px;
	}

	@media (max-width: 640px) {
		.backdrop {
			padding: calc(var(--spacing) * 8);
			align-items: flex-end;
		}
		.carbon {
			height: 92vh;
			max-height: 92vh;
		}
		.tabs-hint {
			display: none;
		}
		.pdf {
			min-height: calc(var(--spacing) * 480);
		}
	}
</style>
