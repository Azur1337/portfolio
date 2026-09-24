export type AnimationEngine = {
	gsap: typeof import('gsap').default;
	ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger;
	Lenis: typeof import('lenis').default;
};

let engine: Promise<AnimationEngine> | undefined;
let settled: AnimationEngine | undefined;

export function loadAnimationEngine(): Promise<AnimationEngine> {
	if (!engine) {
		engine = Promise.all([import('gsap'), import('gsap/ScrollTrigger'), import('lenis')]).then(
			([gsapModule, stModule, lenisModule]) => {
				const gsap = gsapModule.default;
				const ScrollTrigger = stModule.ScrollTrigger;
				gsap.registerPlugin(ScrollTrigger);
				settled = { gsap, ScrollTrigger, Lenis: lenisModule.default };
				return settled;
			}
		);
	}
	return engine;
}

export function getAnimationEngine(): AnimationEngine | undefined {
	return settled;
}
