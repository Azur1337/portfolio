import { defineConfig } from 'vitest/config';

// The portfolio app's own tests. The engine packages (text-splitter,
// ascii-renderer) are separate repos with their own test suites.
export default defineConfig({
	test: {
		include: ['src/**/*.{test,spec}.{ts,js}'],
		environment: 'node',
		passWithNoTests: true
	}
});
