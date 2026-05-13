import rss, { type RSSFeedItem } from "@astrojs/rss"
import { getPublishedBlogPosts } from "@/lib/content"

export const prerender = true

export async function GET() {
  const posts = await getPublishedBlogPosts()

  return rss({
    title: "Sid's Blog",
    description: "Thoughts on engineering, design, and building things.",
    site: "https://sidshub.in",
    items: posts.map(
      (post): RSSFeedItem => ({
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.date,
        link: `/blog/${post.slug}`,
        categories: post.data.tags,
      })
    ),
    customData: `<language>en</language>`,
  })
}
