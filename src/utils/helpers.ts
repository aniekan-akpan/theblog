import type { BlogPost } from './strapi';

export function sortItemsByDateDesc(itemA: BlogPost, itemB: BlogPost) {
    return new Date(itemB.pubDate).getTime() - new Date(itemA.pubDate).getTime();
}

export function createSlugFromTitle(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-'); // Replace multiple hyphens with a single hyphen
}

export function getAllTags(posts: BlogPost[]) {
    const tags: string[] = [...new Set(posts.flatMap((post) => post.tags || []).filter(Boolean))];
    return tags
        .map((tag) => {
            return {
                name: tag,
                id: createSlugFromTitle(tag)
            };
        })
        .filter((obj, pos, arr) => {
            return arr.map((mapObj) => mapObj.id).indexOf(obj.id) === pos;
        });
}

export function getPostsByTag(posts: BlogPost[], tagId: string) {
    const filteredPosts: BlogPost[] = posts.filter((post) => (post.tags || []).map((tag) => createSlugFromTitle(tag)).includes(tagId));
    return filteredPosts;
}

export const withBase = (path: string) => `${import.meta.env.BASE_URL}${path}`;
