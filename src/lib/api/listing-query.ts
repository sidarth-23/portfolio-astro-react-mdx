import type { ListingFilters } from "./listing-api"

export type ListingSort = "date-desc" | "date-asc" | "title-asc" | "title-desc"

const SORT_VALUES: readonly string[] = [
  "date-desc",
  "date-asc",
  "title-asc",
  "title-desc",
]

// Pre-rework URL values still found in bookmarks and shared links.
const LEGACY_SORT_MAP: Record<string, ListingSort> = {
  newest: "date-desc",
  oldest: "date-asc",
  title: "title-asc",
}

export interface ListingFiltersQuery {
  search: string
  tags: string[]
  categories: string[]
  sort: ListingSort | null
  from: string | null
  to: string | null
}

// The user-controllable filter state shared by the filter bar and listing client.
export type ListingFilterState = Omit<ListingFiltersQuery, "search">

export interface ListingRequestQuery extends ListingFiltersQuery {
  page: number
  limit: number
}

function parsePositiveInt(value: string | null, defaultValue: number): number {
  if (value === null) return defaultValue
  const parsed = parseInt(value, 10)
  if (Number.isNaN(parsed) || parsed <= 0) return defaultValue
  return parsed
}

function parseStringArray(value: string | null): string[] {
  if (!value) return []
  return value.split(",").filter((s) => s.length > 0)
}

const DATE_PARAM_PATTERN = /^\d{4}-\d{2}-\d{2}$/

function parseDateParam(value: string | null): string | null {
  if (!value || !DATE_PARAM_PATTERN.test(value)) return null
  if (Number.isNaN(Date.parse(`${value}T00:00:00.000Z`))) return null
  return value
}

export function parseListingFilters(
  searchParams: URLSearchParams
): ListingFiltersQuery {
  const rawSort = searchParams.get("sort")
  let sort: ListingSort | null = null
  if (rawSort) {
    if ((SORT_VALUES as readonly string[]).includes(rawSort)) {
      sort = rawSort as ListingSort
    } else if (rawSort in LEGACY_SORT_MAP) {
      sort = LEGACY_SORT_MAP[rawSort]
    }
  }

  return {
    search: searchParams.get("search") ?? "",
    tags: parseStringArray(searchParams.get("tags")),
    categories: parseStringArray(searchParams.get("categories")),
    sort,
    from: parseDateParam(searchParams.get("from")),
    to: parseDateParam(searchParams.get("to")),
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
  if (query.from) {
    params.set("from", query.from)
  }
  if (query.to) {
    params.set("to", query.to)
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
  if (query.from) {
    params.set("from", query.from)
  }
  if (query.to) {
    params.set("to", query.to)
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
  if (query.from) {
    params.set("from", query.from)
  } else {
    params.delete("from")
  }
  if (query.to) {
    params.set("to", query.to)
  } else {
    params.delete("to")
  }

  const serialized = params.toString()
  return serialized ? `?${serialized}` : ""
}

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
  if (query.from) {
    filters.from = query.from
  }
  if (query.to) {
    filters.to = query.to
  }

  return filters
}
