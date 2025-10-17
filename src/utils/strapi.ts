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
  comments?: StrapiComment[];
  likes?: StrapiLike[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface StrapiProject {
  id: number;
  documentId: string;
  title: string;
  description: string;
  slug: string;
  body?: string;
  technologies?: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  startDate?: string;
  endDate?: string;
  image?: {
    url?: {
      id: number;
      url: string;
      alternativeText?: string;
    };
    alt?: string;
  };
  gallery?: StrapiImage[];
  tags?: string[];
  status?: 'planning' | 'in-progress' | 'completed' | 'maintenance';
  order?: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface StrapiComment {
  id: number;
  documentId: string;
  content: string;
  authorName: string;
  authorEmail: string;
  authorWebsite?: string;
  approved: boolean;
  parentComment?: StrapiComment;
  createdAt: string;
  updatedAt: string;
}

interface StrapiLike {
  id: number;
  documentId: string;
  sessionId: string;
  createdAt: string;
}

interface StrapiPodcast {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: string;
  audioUrl: string;
  duration?: string;
  pubDate: string;
  coverImage?: {
    url?: {
      id: number;
      url: string;
      alternativeText?: string;
    };
    alt?: string;
  };
  tags?: string[];
  transcript?: string;
  author?: string;
  episodeNumber?: number;
  season?: number;
  featured?: boolean;
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
  commentsCount?: number;
  likesCount?: number;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  body?: string;
  technologies?: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  startDate?: Date;
  endDate?: Date;
  image?: {
    url: string;
    alt: string;
  };
  gallery?: {
    url: string;
    alt: string;
  }[];
  tags?: string[];
  status?: 'planning' | 'in-progress' | 'completed' | 'maintenance';
  order?: number;
}

export interface Comment {
  id: string;
  content: string;
  authorName: string;
  authorWebsite?: string;
  approved: boolean;
  createdAt: Date;
  parentComment?: Comment;
}

export interface Like {
  id: string;
  sessionId: string;
  createdAt: Date;
}

export interface Podcast {
  id: string;
  slug: string;
  title: string;
  description: string;
  audioUrl: string;
  duration?: string;
  pubDate: Date;
  coverImage?: {
    url: string;
    alt: string;
  };
  tags?: string[];
  transcript?: string;
  author?: string;
  episodeNumber?: number;
  season?: number;
  featured?: boolean;
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
    commentsCount: strapiPost.comments?.filter(c => c.approved).length || 0,
    likesCount: strapiPost.likes?.length || 0,
  };
}

/**
 * Transform Strapi project to internal format
 */
function transformProject(strapiProject: StrapiProject): Project {
  const imageUrl = strapiProject.image?.url?.url 
    ? `${STRAPI_URL}${strapiProject.image.url.url}`
    : undefined;

  const gallery = strapiProject.gallery?.map(img => ({
    url: `${STRAPI_URL}${img.url}`,
    alt: img.alternativeText || strapiProject.title,
  })) || [];

  return {
    id: strapiProject.documentId,
    slug: strapiProject.slug,
    title: strapiProject.title,
    description: strapiProject.description,
    body: strapiProject.body,
    technologies: strapiProject.technologies,
    liveUrl: strapiProject.liveUrl,
    githubUrl: strapiProject.githubUrl,
    featured: strapiProject.featured,
    startDate: strapiProject.startDate ? new Date(strapiProject.startDate) : undefined,
    endDate: strapiProject.endDate ? new Date(strapiProject.endDate) : undefined,
    image: imageUrl ? {
      url: imageUrl,
      alt: strapiProject.image?.alt || strapiProject.image?.url?.alternativeText || strapiProject.title,
    } : undefined,
    gallery,
    tags: strapiProject.tags,
    status: strapiProject.status,
    order: strapiProject.order,
  };
}

/**
 * Transform Strapi comment to internal format
 */
function transformComment(strapiComment: StrapiComment): Comment {
  return {
    id: strapiComment.documentId,
    content: strapiComment.content,
    authorName: strapiComment.authorName,
    authorWebsite: strapiComment.authorWebsite,
    approved: strapiComment.approved,
    createdAt: new Date(strapiComment.createdAt),
    parentComment: strapiComment.parentComment ? transformComment(strapiComment.parentComment) : undefined,
  };
}

/**
 * Transform Strapi podcast to internal format
 */
function transformPodcast(strapiPodcast: StrapiPodcast): Podcast {
  const imageUrl = strapiPodcast.coverImage?.url?.url 
    ? `${STRAPI_URL}${strapiPodcast.coverImage.url.url}`
    : undefined;

  return {
    id: strapiPodcast.documentId,
    slug: strapiPodcast.slug,
    title: strapiPodcast.title,
    description: strapiPodcast.description,
    audioUrl: strapiPodcast.audioUrl,
    duration: strapiPodcast.duration,
    pubDate: new Date(strapiPodcast.pubDate),
    coverImage: imageUrl ? {
      url: imageUrl,
      alt: strapiPodcast.coverImage?.alt || strapiPodcast.coverImage?.url?.alternativeText || strapiPodcast.title,
    } : undefined,
    tags: strapiPodcast.tags,
    transcript: strapiPodcast.transcript,
    author: strapiPodcast.author,
    episodeNumber: strapiPodcast.episodeNumber,
    season: strapiPodcast.season,
    featured: strapiPodcast.featured,
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

// ==================== PROJECT API FUNCTIONS ====================

/**
 * Get all published projects
 */
export async function getAllProjects(): Promise<Project[]> {
  try {
    const response = await fetchAPI<StrapiResponse<StrapiProject[]>>(
      '/projects?populate=*&sort=order:asc,createdAt:desc'
    );

    return response.data.map(transformProject);
  } catch (error) {
    console.error('Error fetching projects from Strapi:', error);
    return [];
  }
}

/**
 * Get featured projects
 */
export async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const response = await fetchAPI<StrapiResponse<StrapiProject[]>>(
      '/projects?populate=*&filters[featured][$eq]=true&sort=order:asc'
    );

    return response.data.map(transformProject);
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    return [];
  }
}

/**
 * Get a single project by slug
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const response = await fetchAPI<StrapiResponse<StrapiProject[]>>(
      `/projects?populate=*&filters[slug][$eq]=${slug}`
    );

    if (response.data.length === 0) {
      return null;
    }

    return transformProject(response.data[0]);
  } catch (error) {
    console.error(`Error fetching project with slug "${slug}":`, error);
    return null;
  }
}

/**
 * Get paginated projects
 */
export async function getPaginatedProjects(
  page: number = 1,
  pageSize: number = 9
): Promise<{ projects: Project[]; pagination: any }> {
  try {
    const response = await fetchAPI<StrapiResponse<StrapiProject[]>>(
      `/projects?populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=order:asc,createdAt:desc`
    );

    return {
      projects: response.data.map(transformProject),
      pagination: response.meta.pagination,
    };
  } catch (error) {
    console.error('Error fetching paginated projects:', error);
    return { projects: [], pagination: null };
  }
}

// ==================== COMMENT API FUNCTIONS ====================

/**
 * Get approved comments for a blog post
 */
export async function getCommentsByPostId(postId: string): Promise<Comment[]> {
  try {
    const response = await fetchAPI<StrapiResponse<StrapiComment[]>>(
      `/comments?filters[blog_post][documentId][$eq]=${postId}&filters[approved][$eq]=true&populate=parentComment&sort=createdAt:desc`
    );

    return response.data.map(transformComment);
  } catch (error) {
    console.error(`Error fetching comments for post "${postId}":`, error);
    return [];
  }
}

/**
 * Create a new comment
 */
export async function createComment(data: {
  content: string;
  authorName: string;
  authorEmail: string;
  authorWebsite?: string;
  blogPostId: string;
  parentCommentId?: string;
}): Promise<Comment | null> {
  try {
    const response = await fetchAPI<StrapiResponse<StrapiComment>>(
      '/comments',
      {
        method: 'POST',
        body: JSON.stringify({
          data: {
            content: data.content,
            authorName: data.authorName,
            authorEmail: data.authorEmail,
            authorWebsite: data.authorWebsite,
            blog_post: data.blogPostId,
            parentComment: data.parentCommentId,
          },
        }),
      }
    );

    return transformComment(response.data);
  } catch (error) {
    console.error('Error creating comment:', error);
    return null;
  }
}

// ==================== LIKE API FUNCTIONS ====================

/**
 * Get like count for a blog post
 */
export async function getLikeCountByPostId(postId: string): Promise<number> {
  try {
    const response = await fetchAPI<StrapiResponse<StrapiLike[]>>(
      `/likes?filters[blog_post][documentId][$eq]=${postId}`
    );

    return response.data.length;
  } catch (error) {
    console.error(`Error fetching like count for post "${postId}":`, error);
    return 0;
  }
}

/**
 * Check if a session has liked a post
 */
export async function checkIfLiked(postId: string, sessionId: string): Promise<boolean> {
  try {
    const response = await fetchAPI<StrapiResponse<StrapiLike[]>>(
      `/likes?filters[blog_post][documentId][$eq]=${postId}&filters[sessionId][$eq]=${sessionId}`
    );

    return response.data.length > 0;
  } catch (error) {
    console.error('Error checking like status:', error);
    return false;
  }
}

/**
 * Create a like
 */
export async function createLike(blogPostId: string, sessionId: string): Promise<boolean> {
  try {
    await fetchAPI<StrapiResponse<StrapiLike>>(
      '/likes',
      {
        method: 'POST',
        body: JSON.stringify({
          data: {
            blog_post: blogPostId,
            sessionId,
          },
        }),
      }
    );

    return true;
  } catch (error) {
    console.error('Error creating like:', error);
    return false;
  }
}

/**
 * Remove a like
 */
export async function removeLike(likeId: string): Promise<boolean> {
  try {
    await fetchAPI(
      `/likes/${likeId}`,
      {
        method: 'DELETE',
      }
    );

    return true;
  } catch (error) {
    console.error('Error removing like:', error);
    return false;
  }
}

// ==================== PODCAST API FUNCTIONS ====================

/**
 * Get all published podcasts
 */
export async function getAllPodcasts(): Promise<Podcast[]> {
  try {
    const response = await fetchAPI<StrapiResponse<StrapiPodcast[]>>(
      '/podcasts?populate=*&sort=pubDate:desc'
    );

    return response.data.map(transformPodcast);
  } catch (error) {
    console.error('Error fetching podcasts from Strapi:', error);
    return [];
  }
}

/**
 * Get a single podcast by slug
 */
export async function getPodcastBySlug(slug: string): Promise<Podcast | null> {
  try {
    const response = await fetchAPI<StrapiResponse<StrapiPodcast[]>>(
      `/podcasts?populate=*&filters[slug][$eq]=${slug}`
    );

    if (response.data.length === 0) {
      return null;
    }

    return transformPodcast(response.data[0]);
  } catch (error) {
    console.error(`Error fetching podcast "${slug}":`, error);
    return null;
  }
}

/**
 * Get featured podcasts
 */
export async function getFeaturedPodcasts(): Promise<Podcast[]> {
  try {
    const response = await fetchAPI<StrapiResponse<StrapiPodcast[]>>(
      '/podcasts?populate=*&filters[featured][$eq]=true&sort=pubDate:desc'
    );

    return response.data.map(transformPodcast);
  } catch (error) {
    console.error('Error fetching featured podcasts:', error);
    return [];
  }
}

/**
 * Delete a like
 */
export async function deleteLike(likeId: string, sessionId: string): Promise<boolean> {
  try {
    await fetchAPI(
      `/likes/${likeId}?sessionId=${sessionId}`,
      {
        method: 'DELETE',
      }
    );

    return true;
  } catch (error) {
    console.error('Error deleting like:', error);
    return false;
  }
}
