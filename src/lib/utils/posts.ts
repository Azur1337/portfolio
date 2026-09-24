import type { Component } from 'svelte';
import { calculateReadingTime } from '$lib/utils/reading-time';

export interface PostMeta {
	title: string;
	date: string;
	description: string;
	tags: string[];
	published: boolean;
	slug: string;
	readingTime: number;
}

export interface Post {
	meta: PostMeta;
	component: Component;
}

type PostModule = {
	default: Component;
	metadata?: {
		title?: string;
		date?: string;
		description?: string;
		tags?: string[];
		published?: boolean;
	};
};

const postModules = import.meta.glob<PostModule>('/src/posts/*.{md,svx}', { eager: true });

const postSources = import.meta.glob<string>('/src/posts/*.{md,svx}', {
	eager: true,
	query: '?raw',
	import: 'default'
});

function getSlugFromPath(path: string): string {
	const filename = path.split('/').pop() || '';
	return filename.replace(/\.(md|svx)$/, '');
}

function stripFrontmatter(raw: string): string {
	return raw.replace(/^---[\s\S]*?---\s*/, '');
}

function extractMetadata(module: PostModule, slug: string, raw: string | undefined): PostMeta {
	const metadata = module.metadata || {};
	const readingTime = raw ? calculateReadingTime(stripFrontmatter(raw)) : 1;

	return {
		title: metadata.title || 'Untitled',
		date: metadata.date || new Date().toISOString().split('T')[0],
		description: metadata.description || '',
		tags: metadata.tags || [],
		published: metadata.published !== undefined ? metadata.published : true,
		slug,
		readingTime
	};
}

export function getAllPosts(options: { includeUnpublished?: boolean } = {}): Post[] {
	const posts: Post[] = [];

	for (const [path, module] of Object.entries(postModules)) {
		const slug = getSlugFromPath(path);
		const meta = extractMetadata(module, slug, postSources[path]);

		if (!meta.published && !options.includeUnpublished) continue;

		posts.push({ meta, component: module.default });
	}

	return posts.sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime());
}

export function getPostBySlug(slug: string): Post | null {
	for (const [path, module] of Object.entries(postModules)) {
		if (getSlugFromPath(path) !== slug) continue;
		const meta = extractMetadata(module, slug, postSources[path]);
		return { meta, component: module.default };
	}
	return null;
}

export function getPublishedSlugs(): string[] {
	return getAllPosts().map((post) => post.meta.slug);
}
