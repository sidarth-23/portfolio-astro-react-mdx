import rss, { type RSSFeedItem } from "@astrojs/rss"
import { getPublishedBlogPosts } from "@/lib/content/queries"
import { locales, defaultLocale, type Locale } from "@/i18n/config"
import { t } from "@/i18n/ui"
import { SITE_URL } from "astro:env/server"

export const prerender = true

export async function getStaticPaths() {
  return locales.map((locale) => ({ params: { locale } }))
}

export async function GET(context: { params: { locale: string } }) {
  const locale = context.params.locale as Locale
  const posts = await getPublishedBlogPosts(locale)

  return rss({
    title: locale === defaultLocale ? "Sid's Blog" : `Sid's Blog (${locale})`,
    description: t(locale, "rss.description"),
    site: SITE_URL,
    items: posts.map(
      (post): RSSFeedItem => ({
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.date,
        link: `/${locale}/blog/${post.id.split("/").slice(1).join("/")}`,
        categories: post.data.tags,
      })
    ),
    customData: `<language>${locale}</language>`,
  })
}
