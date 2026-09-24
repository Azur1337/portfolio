import { error } from '@sveltejs/kit';
import { getPostBySlug, getPublishedSlugs } from '$lib/utils/posts';
import type { PageLoad } from './$types';

export const prerender = true;

export function entries() {
	return getPublishedSlugs().map((slug) => ({ slug }));
}

export const load: PageLoad = ({ params }) => {
	const post = getPostBySlug(params.slug);
	if (!post || !post.meta.published) {
		throw error(404, 'Post not found');
	}
	return { post };
};
