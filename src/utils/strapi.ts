// Strapi API configuration
export const STRAPI_URL = import.meta.env.PUBLIC_STRAPI_URL || 'http://localhost:1337';
export const STRAPI_API_TOKEN = import.meta.env.STRAPI_API_TOKEN || '';

interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface StrapiImage {
  id: number;
  url: string;
  alternativeText?: string;
  width: number;
  height: number;
}

interface StrapiBlogPost {
  id: number;
  documentId: string;
  title: string;
  description: string;
  pubDate: string;
  author?: string;
  tags?: string[];
  draft?: boolean;
  slug: string;
  body?: string;
  image?: {
    url?: {
      id: number;
      url: string;
      alternativeText?: string;
    };
    alt?: string;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  pubDate: Date;
  author?: string;
  tags?: string[];
  draft?: boolean;
  image?: {
    url: string;
    alt: string;
  };
  body?: string;
}

/**
 * Fetch data from Strapi API
 */
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  const res = await fetch(`${STRAPI_URL}/api${endpoint}`, mergedOptions);

  if (!res.ok) {
    throw new Error(`Strapi API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/**
 * Transform Strapi blog post to internal format
 */
function transformBlogPost(strapiPost: StrapiBlogPost): BlogPost {
  const imageUrl = strapiPost.image?.url?.url 
    ? `${STRAPI_URL}${strapiPost.image.url.url}`
    : undefined;

  return {
    id: strapiPost.documentId,
    slug: strapiPost.slug,
    title: strapiPost.title,
    description: strapiPost.description,
    pubDate: new Date(strapiPost.pubDate),
    author: strapiPost.author,
    tags: strapiPost.tags,
    draft: strapiPost.draft,
    image: imageUrl ? {
      url: imageUrl,
      alt: strapiPost.image?.alt || strapiPost.image?.url?.alternativeText || strapiPost.title,
    } : undefined,
    body: strapiPost.body,
  };
}

/**
 * Get all published blog posts
 */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetchAPI<StrapiResponse<StrapiBlogPost[]>>(
      '/blog-posts?populate=*&sort=pubDate:desc&filters[draft][$eq]=false'
    );

    return response.data.map(transformBlogPost);
  } catch (error) {
    console.error('Error fetching blog posts from Strapi:', error);
    return [];
  }
}

/**
 * Get a single blog post by slug
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetchAPI<StrapiResponse<StrapiBlogPost[]>>(
      `/blog-posts?populate=*&filters[slug][$eq]=${slug}`
    );

    if (response.data.length === 0) {
      return null;
    }

    return transformBlogPost(response.data[0]);
  } catch (error) {
    console.error(`Error fetching blog post with slug "${slug}":`, error);
    return null;
  }
}

/**
 * Get blog posts by tag
 */
export async function getBlogPostsByTag(tag: string): Promise<BlogPost[]> {
  try {
    const response = await fetchAPI<StrapiResponse<StrapiBlogPost[]>>(
      `/blog-posts?populate=*&filters[tags][$contains]=${tag}&filters[draft][$eq]=false&sort=pubDate:desc`
    );

    return response.data.map(transformBlogPost);
  } catch (error) {
    console.error(`Error fetching blog posts with tag "${tag}":`, error);
    return [];
  }
}

/**
 * Get all unique tags from blog posts
 */
export async function getAllTags(): Promise<string[]> {
  try {
    const posts = await getAllBlogPosts();
    const tagsSet = new Set<string>();

    posts.forEach(post => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach(tag => tagsSet.add(tag));
      }
    });

    return Array.from(tagsSet).sort();
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
}

/**
 * Get paginated blog posts
 */
export async function getPaginatedBlogPosts(
  page: number = 1,
  pageSize: number = 10
): Promise<{ posts: BlogPost[]; pagination: any }> {
  try {
    const response = await fetchAPI<StrapiResponse<StrapiBlogPost[]>>(
      `/blog-posts?populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}&filters[draft][$eq]=false&sort=pubDate:desc`
    );

    return {
      posts: response.data.map(transformBlogPost),
      pagination: response.meta.pagination,
    };
  } catch (error) {
    console.error('Error fetching paginated blog posts:', error);
    return { posts: [], pagination: null };
  }
}
