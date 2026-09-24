import type Lenis from 'lenis';

export const lenisInstance: { current: Lenis | undefined } = { current: undefined };

export const scrollEase = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

export function anchorScroll(e: MouseEvent, href: string): boolean {
	if (!href.startsWith('#')) return false;
	const lenis = lenisInstance.current;
	if (!lenis) return false;
	e.preventDefault();

	lenis.scrollTo(href, { offset: 0, duration: 1.2, easing: scrollEase });
	return true;
}
