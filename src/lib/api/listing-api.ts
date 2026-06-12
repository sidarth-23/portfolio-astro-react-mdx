import type { Locale } from "@/i18n/config"
import { searchBlogSlugs } from "@/lib/search/listing-search"

import { getListingData } from "./listing-data"

import type { ListingSort } from "./listing-query"

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
const MIN_SEARCH_LENGTH = 2

function applyFilters<T extends { tags: string[]; category?: string }>(
  items: T[],
  filters: ListingFilters
): T[] {
  let filtered = items

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

  return {
    items: items.slice(start, end),
    hasMore: end < items.length,
    total: items.length,
  }
}

export async function getBlogListing(
  locale: Locale,
  filters: ListingFilters = {}
): Promise<ListingResponse<BlogListingItem>> {
  const data = await getListingData(locale)

  const search = filters.search?.trim() ?? ""
  const isSearching = search.length >= MIN_SEARCH_LENGTH

  let items = data.items
  if (isSearching) {
    const slugs = await searchBlogSlugs(locale, search)
    items = slugs
      .map((slug) => data.bySlug.get(slug))
      .filter((item): item is BlogListingItem => item !== undefined)
  }

  let filtered = applyFilters(items, filters)

  // While searching without an explicit sort, keep relevance order.
  if (filters.sort || !isSearching) {
    filtered = applySorting(filtered, filters.sort)
  }

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
  const data = await getListingData(locale)

  return {
    tags: data.tags,
    categories: data.categories,
  }
}
