import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		fs: {
			// the "The code" editor lazy-loads the real package sources through
			// import.meta.glob(..., '?raw'). SvelteKit's Vite root is src/, so the
			// repo root has to be allow-listed for those dev-server requests
			allow: ['..']
		}
	}
});
