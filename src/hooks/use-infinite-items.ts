"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { useEffect, useRef } from "react"
import type { PaginatedResponse } from "@/lib/api"

interface UseInfiniteItemsOptions {
  endpoint: string
  locale: string
  tags: string[]
  categories: string[]
  search: string | null
  sort: string | null
  limit: number
  enabled?: boolean
}

export function useInfiniteItems<T>({
  endpoint,
  locale,
  tags,
  categories,
  search,
  sort,
  limit,
  enabled = true,
}: UseInfiniteItemsOptions) {
  const query = useInfiniteQuery({
    queryKey: [endpoint, locale, tags, categories, search, sort, limit],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams({
        locale,
        page: String(pageParam),
        limit: String(limit),
      })
      if (tags.length > 0) params.set("tags", tags.join(","))
      if (categories.length > 0)
        params.set("categories", categories.join(","))
      if (search) params.set("search", search)
      if (sort) params.set("sort", sort)

      const response = await fetch(`${endpoint}?${params}`)
      if (!response.ok) throw new Error("Failed to fetch")
      return response.json() as Promise<PaginatedResponse<T>>
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasMore) return undefined
      return allPages.length + 1
    },
    initialPageParam: 1,
    enabled,
    placeholderData: (previousData) => previousData,
  })

  const { hasNextPage, isFetchingNextPage, fetchNextPage } = query

  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasNextPage || isFetchingNextPage) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage()
        }
      },
      { rootMargin: "200px" }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const allItems = query.data?.pages.flatMap((page) => page.items) ?? []

  return {
    ...query,
    allItems,
    sentinelRef,
  }
}