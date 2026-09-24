export function calculateReadingTime(text: string): number {
	const words = text
		.trim()
		.split(/\s+/)
		.filter((word) => word.length > 0).length;
	const wpm = 230;
	return Math.max(1, Math.ceil(words / wpm));
}
