"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { useEffect, useRef } from "react"
import {
  filterBySearch,
  filterByTags,
  filterByCategories,
  sortItems,
  paginate,
} from "@/lib/api"
import type { SortMode } from "@/lib/api"

interface PaginatedResult<T> {
  items: T[]
  hasMore: boolean
  total: number
}

interface UseLocalInfiniteItemsOptions<T> {
  items: T[]
  search: string
  tags: string[]
  categories: string[]
  sort: SortMode | null
  limit: number
}

export function useLocalInfiniteItems<T>({
  items,
  search,
  tags,
  categories,
  sort,
  limit,
}: UseLocalInfiniteItemsOptions<T>) {
  const query = useInfiniteQuery<PaginatedResult<T>>({
    queryKey: ["local-items", items.length, search, tags, categories, sort, limit],
    queryFn: ({ pageParam = 1 }) => {
      let filtered = [...items]
      filtered = filterByTags(filtered as { tags: string[] }[], tags.length > 0 ? tags : null) as T[]
      filtered = filterByCategories(filtered as { category?: string }[], categories.length > 0 ? categories : null) as T[]
      filtered = filterBySearch(filtered as { title: string }[], search || null) as T[]
      filtered = sortItems(filtered as { date: string; title: string }[], sort) as T[]
      return paginate(filtered, pageParam, limit)
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasMore) return undefined
      return allPages.length + 1
    },
    initialPageParam: 1,
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

  const allItems = query.data?.pages.flatMap((page: PaginatedResult<T>) => page.items) ?? []

  return {
    ...query,
    allItems,
    sentinelRef,
  }
}
