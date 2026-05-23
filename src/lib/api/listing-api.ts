import { getCollection } from "astro:content"
import type { Locale } from "@/i18n/config"
import { locales } from "@/i18n/config"
import {
  getOptimizedImageSet,
  generateSrcSet,
  generateSizes,
} from "./image-manifest"

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

export interface ProjectListingItem {
  slug: string
  title: string
  summary: string
  date: string
  updatedDate?: string
  featured: boolean
  status: string
  category?: string
  tags: string[]
  coverImage: ListingImage
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
  sort?: "newest" | "oldest" | "title"
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
  originalPath: string,
  alt: string
): Promise<ListingImage> {
  const optimizedSet = await getOptimizedImageSet(originalPath)

  if (optimizedSet) {
    return {
      src: optimizedSet["600"],
      srcSet: generateSrcSet(optimizedSet),
      sizes: generateSizes(),
      width: 600,
      height: 340,
      alt,
    }
  }

  // Fallback for unoptimized images
  return {
    src: originalPath,
    srcSet: "",
    sizes: "",
    width: 600,
    height: 340,
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

function applyFilters<T extends { title: string; tags: string[]; category?: string }>(
  items: T[],
  filters: ListingFilters
): T[] {
  let filtered = [...items]

  if (filters.search) {
    const query = filters.search.toLowerCase().trim()
    filtered = filtered.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        ("description" in item &&
          (item as unknown as { description: string }).description
            .toLowerCase()
            .includes(query)) ||
        ("summary" in item &&
          (item as unknown as { summary: string }).summary
            .toLowerCase()
            .includes(query))
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
  sort?: "newest" | "oldest" | "title"
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

  const items = await Promise.all(
    filteredByLocale.map(async (post) => ({
      slug: getContentSlug(post.id),
      title: post.data.title,
      description: post.data.description,
      date: post.data.date.toISOString(),
      updatedDate: post.data.updatedDate?.toISOString(),
      category: post.data.category,
      tags: post.data.tags,
      coverImage: await createListingImage(
        typeof post.data.coverImage === "string"
          ? post.data.coverImage
          : post.data.coverImage.src,
        post.data.title
      ),
    }))
  )

  let filtered = applyFilters(items, filters)
  filtered = applySorting(filtered, filters.sort)

  const page = filters.page ?? 1
  const limit = filters.limit ?? DEFAULT_LIMIT
  const paginated = applyPagination(filtered, page, limit)

  return {
    ...paginated,
    page,
  }
}

export async function getProjectListing(
  locale: Locale,
  filters: ListingFilters = {}
): Promise<ListingResponse<ProjectListingItem>> {
  const projects = await getCollection("projects")
  const filteredByLocale = filterByLocale(projects, locale)

  const items = await Promise.all(
    filteredByLocale.map(async (project) => ({
      slug: getContentSlug(project.id),
      title: project.data.title,
      summary: project.data.summary,
      date: project.data.date.toISOString(),
      updatedDate: project.data.updatedDate?.toISOString(),
      featured: project.data.featured,
      status: project.data.status,
      category: project.data.category,
      tags: project.data.tags,
      coverImage: await createListingImage(
        typeof project.data.coverImage === "string"
          ? project.data.coverImage
          : project.data.coverImage.src,
        project.data.title
      ),
    }))
  )

  let filtered = applyFilters(items, filters)
  filtered = applySorting(filtered, filters.sort)

  const page = filters.page ?? 1
  const limit = filters.limit ?? DEFAULT_LIMIT
  const paginated = applyPagination(filtered, page, limit)

  return {
    ...paginated,
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

export async function getProjectFilters(locale: Locale): Promise<{
  tags: string[]
  categories: string[]
}> {
  const projects = await getCollection("projects")
  const filtered = filterByLocale(projects, locale)

  const tags = new Set<string>()
  const categories = new Set<string>()

  for (const project of filtered) {
    project.data.tags.forEach((tag) => tags.add(tag))
    if (project.data.category) {
      categories.add(project.data.category)
    }
  }

  return {
    tags: Array.from(tags).sort(),
    categories: Array.from(categories).sort(),
  }
}
