import { getImage } from "astro:assets"
import { getCollection } from "astro:content"

import { locales, type Locale } from "@/i18n/config"

import type { BlogListingItem, ListingImage } from "./listing-api"
import type { ImageMetadata } from "astro"

export interface ListingData {
  items: BlogListingItem[]
  tags: string[]
  categories: string[]
  bySlug: Map<string, BlogListingItem>
}

function getLocaleFromSlug(slug: string): Locale {
  const firstSegment = slug.split("/")[0]
  if (locales.includes(firstSegment as Locale)) {
    return firstSegment as Locale
  }
  return "en"
}

function getContentSlug(slug: string): string {
  const parts = slug.split("/")
  if (locales.includes(parts[0] as Locale)) {
    return parts.slice(1).join("/")
  }
  return slug
}

async function createListingImage(
  source: ImageMetadata,
  alt: string
): Promise<ListingImage> {
  const [image400, image600, image1200] = await Promise.all([
    getImage({
      src: source,
      width: 400,
      format: "webp",
      quality: 80,
    }),
    getImage({
      src: source,
      width: 600,
      format: "webp",
      quality: 80,
    }),
    getImage({
      src: source,
      width: 1200,
      format: "webp",
      quality: 80,
    }),
  ])

  return {
    src: image600.src,
    srcSet: `${image400.src} 400w, ${image600.src} 600w, ${image1200.src} 1200w`,
    sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
    width: image600.attributes.width ?? 600,
    height: image600.attributes.height ?? 340,
    alt,
  }
}

async function buildListingData(locale: Locale): Promise<ListingData> {
  const posts = await getCollection("blog", ({ data }) => !data.draft)
  const localePosts = posts.filter((post) => {
    const entryLocale = post.data.locale ?? getLocaleFromSlug(post.id)
    return entryLocale === locale
  })

  const items = await Promise.all(
    localePosts.map(
      async (post): Promise<BlogListingItem> => ({
        slug: getContentSlug(post.id),
        title: post.data.title,
        description: post.data.description,
        date: post.data.date.toISOString(),
        updatedDate: post.data.updatedDate?.toISOString(),
        category: post.data.category,
        tags: post.data.tags,
        coverImage: await createListingImage(
          post.data.coverImage,
          post.data.title
        ),
      })
    )
  )

  items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const tags = new Set<string>()
  const categories = new Set<string>()
  const bySlug = new Map<string, BlogListingItem>()

  for (const item of items) {
    item.tags.forEach((tag) => tags.add(tag))
    if (item.category) categories.add(item.category)
    bySlug.set(item.slug, item)
  }

  return {
    items,
    tags: Array.from(tags).sort(),
    categories: Array.from(categories).sort(),
    bySlug,
  }
}

// Per-isolate memoization: the listing (incl. resolved image URLs) is
// build-time static, so compute it once per locale and share the promise
// between concurrent first requests.
const listingCache = new Map<Locale, Promise<ListingData>>()

export function getListingData(locale: Locale): Promise<ListingData> {
  const cached = listingCache.get(locale)
  if (cached) return cached

  const data = buildListingData(locale)
  listingCache.set(locale, data)
  return data
}

export function resetListingCache(): void {
  listingCache.clear()
}
