import rss from "@astrojs/rss";
import { withBase } from "../utils/helpers";
import siteConfig from "../site.config";
import { getAllBlogPosts } from "../utils/strapi";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const blog = await getAllBlogPosts();
  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: context.site + withBase("/"),
    trailingSlash: false,
    items: blog.map((post) => ({
      title: post.title,
      pubDate: post.pubDate,
      description: post.description,
      // Compute RSS link from post slug
      link: withBase(`/blog/${post.slug}/`),
    })),
    customData: `<language>en-US</language>`,
    stylesheet: withBase("/pretty-feed-v3.xsl"),
  });
}
