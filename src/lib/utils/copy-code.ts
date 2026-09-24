export function copyCodeAction(node: HTMLElement) {
	const blocks = node.querySelectorAll('pre');

	blocks.forEach((block) => {
		if (block.querySelector('.copy-button')) return;
		const code = block.querySelector('code');
		if (!code) return;

		if (block instanceof HTMLElement) block.style.position = 'relative';

		const button = document.createElement('button');
		button.type = 'button';
		button.className =
			'copy-button font-mono text-ui rounded-4 border border-white/15 bg-black-deep/60 px-8 py-4 text-ghost-grey transition-colors hover:text-accent';
		button.textContent = '[ copy ]';
		button.style.position = 'absolute';
		button.style.top = '8px';
		button.style.right = '8px';
		button.style.zIndex = '10';
		button.setAttribute('aria-label', 'Copy code');

		button.addEventListener('click', async () => {
			const text = code.textContent || '';
			try {
				await navigator.clipboard.writeText(text);
				button.textContent = '[ copied ]';
			} catch (e) {
				console.error('Failed to copy:', e);
				button.textContent = '[ error ]';
			}
			setTimeout(() => {
				button.textContent = '[ copy ]';
			}, 2000);
		});

		block.appendChild(button);
	});

	return {
		destroy() {}
	};
}
