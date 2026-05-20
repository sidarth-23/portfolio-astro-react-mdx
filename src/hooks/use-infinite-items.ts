"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { useEffect, useRef } from "react"
import type { PaginatedResponse } from "@/lib/api-serialization"

interface UseInfiniteItemsOptions {
  endpoint: string
  locale: string
  tag: string | null
  search: string | null
  limit: number
  enabled?: boolean
}

export function useInfiniteItems<T>({
  endpoint,
  locale,
  tag,
  search,
  limit,
  enabled = true,
}: UseInfiniteItemsOptions) {
  const query = useInfiniteQuery({
    queryKey: [endpoint, locale, tag, search, limit],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams({
        locale,
        page: String(pageParam),
        limit: String(limit),
      })
      if (tag) params.set("tag", tag)
      if (search) params.set("search", search)

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
