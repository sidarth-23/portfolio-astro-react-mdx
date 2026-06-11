import { getImage } from "astro:assets"
import { getCollection } from "astro:content"

import type { Locale } from "@/i18n/config"
import { locales } from "@/i18n/config"

import type { ListingSort } from "./listing-query"
import type { ImageMetadata } from "astro"

export interface ListingImage {
  src: string
  srcSet: string
  sizes: string
  width: number
  height: number
  alt: string
}

export interface BlogListingItem {
  slug: string
  title: string
  description: string
  date: string
  updatedDate?: string
  category?: string
  tags: string[]
  coverImage: ListingImage
}

interface BlogListingItemBase {
  slug: string
  title: string
  description: string
  date: string
  updatedDate?: string
  category?: string
  tags: string[]
  coverImageSource: ImageMetadata
}

export interface ListingResponse<T> {
  items: T[]
  hasMore: boolean
  total: number
  page: number
}

export interface ListingFilters {
  search?: string
  tags?: string[]
  categories?: string[]
  sort?: ListingSort
  page?: number
  limit?: number
}

const DEFAULT_LIMIT = 12

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

function filterByLocale<T extends { id: string; data: { locale?: string } }>(
  entries: T[],
  locale: Locale
): T[] {
  return entries.filter((entry) => {
    const entryLocale = entry.data.locale ?? getLocaleFromSlug(entry.id)
    return entryLocale === locale
  })
}

function applyFilters<
  T extends { title: string; tags: string[]; category?: string },
>(items: T[], filters: ListingFilters): T[] {
  let filtered = [...items]

  if (filters.search) {
    const query = filters.search.toLowerCase().trim()
    filtered = filtered.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        ("description" in item &&
          typeof item.description === "string" &&
          item.description.toLowerCase().includes(query)) ||
        item.tags.some((tag) => tag.toLowerCase().includes(query))
    )
  }

  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter((item) =>
      filters.tags!.some((tag) => item.tags.includes(tag))
    )
  }

  if (filters.categories && filters.categories.length > 0) {
    filtered = filtered.filter(
      (item) => item.category && filters.categories!.includes(item.category)
    )
  }

  return filtered
}

function applySorting<T extends { date: string; title: string }>(
  items: T[],
  sort?: ListingSort
): T[] {
  if (!sort || sort === "newest") {
    return [...items].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  }
  if (sort === "oldest") {
    return [...items].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )
  }
  if (sort === "title") {
    return [...items].sort((a, b) => a.title.localeCompare(b.title))
  }
  return items
}

function applyPagination<T>(
  items: T[],
  page: number,
  limit: number
): { items: T[]; hasMore: boolean; total: number } {
  const start = (page - 1) * limit
  const end = start + limit
  const paginatedItems = items.slice(start, end)

  return {
    items: paginatedItems,
    hasMore: end < items.length,
    total: items.length,
  }
}

export async function getBlogListing(
  locale: Locale,
  filters: ListingFilters = {}
): Promise<ListingResponse<BlogListingItem>> {
  const posts = await getCollection("blog", ({ data }) => !data.draft)
  const filteredByLocale = filterByLocale(posts, locale)

  const items: BlogListingItemBase[] = filteredByLocale.map((post) => ({
    slug: getContentSlug(post.id),
    title: post.data.title,
    description: post.data.description,
    date: post.data.date.toISOString(),
    updatedDate: post.data.updatedDate?.toISOString(),
    category: post.data.category,
    tags: post.data.tags,
    coverImageSource: post.data.coverImage,
  }))

  let filtered = applyFilters(items, filters)
  filtered = applySorting(filtered, filters.sort)

  const page = filters.page ?? 1
  const limit = filters.limit ?? DEFAULT_LIMIT
  const paginated = applyPagination(filtered, page, limit)
  const paginatedItems = await Promise.all(
    paginated.items.map(
      async (post): Promise<BlogListingItem> => ({
        slug: post.slug,
        title: post.title,
        description: post.description,
        date: post.date,
        updatedDate: post.updatedDate,
        category: post.category,
        tags: post.tags,
        coverImage: await createListingImage(post.coverImageSource, post.title),
      })
    )
  )

  return {
    ...paginated,
    items: paginatedItems,
    page,
  }
}

export async function getBlogFilters(locale: Locale): Promise<{
  tags: string[]
  categories: string[]
}> {
  const posts = await getCollection("blog", ({ data }) => !data.draft)
  const filtered = filterByLocale(posts, locale)

  const tags = new Set<string>()
  const categories = new Set<string>()

  for (const post of filtered) {
    post.data.tags.forEach((tag) => tags.add(tag))
    if (post.data.category) {
      categories.add(post.data.category)
    }
  }

  return {
    tags: Array.from(tags).sort(),
    categories: Array.from(categories).sort(),
  }
}
