export type ListingSort = "newest" | "oldest" | "title"

const SORT_VALUES: readonly string[] = ["newest", "oldest", "title"]

export interface ListingFiltersQuery {
  search: string
  tags: string[]
  categories: string[]
  sort: ListingSort | null
}

export interface ListingRequestQuery extends ListingFiltersQuery {
  page: number
  limit: number
}

function parsePositiveInt(
  value: string | null,
  defaultValue: number
): number {
  if (value === null) return defaultValue
  const parsed = parseInt(value, 10)
  if (Number.isNaN(parsed) || parsed <= 0) return defaultValue
  return parsed
}

function parseStringArray(value: string | null): string[] {
  if (!value) return []
  return value.split(",").filter((s) => s.length > 0)
}

export function parseListingFilters(
  searchParams: URLSearchParams
): ListingFiltersQuery {
  const rawSort = searchParams.get("sort")
  const sort: ListingSort | null =
    rawSort && (SORT_VALUES as readonly string[]).includes(rawSort)
      ? (rawSort as ListingSort)
      : null

  return {
    search: searchParams.get("search") ?? "",
    tags: parseStringArray(searchParams.get("tags")),
    categories: parseStringArray(searchParams.get("categories")),
    sort,
  }
}

export function parseListingRequest(
  searchParams: URLSearchParams,
  defaults: { page?: number; limit?: number } = {}
): ListingRequestQuery {
  const filters = parseListingFilters(searchParams)
  return {
    ...filters,
    page: parsePositiveInt(searchParams.get("page"), defaults.page ?? 1),
    limit: parsePositiveInt(searchParams.get("limit"), defaults.limit ?? 12),
  }
}

export function serializeListingFilters(query: ListingFiltersQuery): string {
  const params = new URLSearchParams()

  if (query.search) {
    params.set("search", query.search)
  }
  if (query.tags.length > 0) {
    params.set("tags", query.tags.join(","))
  }
  if (query.categories.length > 0) {
    params.set("categories", query.categories.join(","))
  }
  if (query.sort) {
    params.set("sort", query.sort)
  }

  return params.toString()
}

export function serializeListingRequest(query: ListingRequestQuery): string {
  const params = new URLSearchParams()

  params.set("page", String(query.page))
  params.set("limit", String(query.limit))

  if (query.search) {
    params.set("search", query.search)
  }
  if (query.tags.length > 0) {
    params.set("tags", query.tags.join(","))
  }
  if (query.categories.length > 0) {
    params.set("categories", query.categories.join(","))
  }
  if (query.sort) {
    params.set("sort", query.sort)
  }

  return params.toString()
}

export function mergeListingFilters(
  currentSearch: string,
  query: ListingFiltersQuery
): string {
  const params = new URLSearchParams(currentSearch.replace(/^\?/, ""))

  // Update listing keys
  if (query.search) {
    params.set("search", query.search)
  } else {
    params.delete("search")
  }
  if (query.tags.length > 0) {
    params.set("tags", query.tags.join(","))
  } else {
    params.delete("tags")
  }
  if (query.categories.length > 0) {
    params.set("categories", query.categories.join(","))
  } else {
    params.delete("categories")
  }
  if (query.sort) {
    params.set("sort", query.sort)
  } else {
    params.delete("sort")
  }

  const serialized = params.toString()
  return serialized ? `?${serialized}` : ""
}

import type { ListingFilters } from "./listing-api"

export function toListingFilters(query: ListingFiltersQuery): ListingFilters {
  const filters: ListingFilters = {}

  if (query.search) {
    filters.search = query.search
  }
  if (query.tags.length > 0) {
    filters.tags = query.tags
  }
  if (query.categories.length > 0) {
    filters.categories = query.categories
  }
  if (query.sort) {
    filters.sort = query.sort
  }

  return filters
}
