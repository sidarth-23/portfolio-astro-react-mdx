"use client"

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useRef } from "react"

import type { ListingResponse, BlogListingItem } from "@/lib/api/listing-api"
import { serializeListingRequest } from "@/lib/api/listing-query"
import type { ListingSort } from "@/lib/api/listing-query"

interface UseListingQueryOptions {
  endpoint: string
  locale: string
  search?: string
  tags?: string[]
  categories?: string[]
  sort?: ListingSort | null
  initialData?: ListingResponse<BlogListingItem>
  limit?: number
}

export function useListingQuery<T extends BlogListingItem>({
  endpoint,
  locale,
  search,
  tags,
  categories,
  sort,
  initialData,
  limit = 12,
}: UseListingQueryOptions) {
  const query = useInfiniteQuery<ListingResponse<T>>({
    queryKey: [
      "listing",
      endpoint,
      locale,
      search,
      tags,
      categories,
      sort,
      limit,
    ],
    queryFn: async ({ pageParam = 1 }) => {
      const page = typeof pageParam === "number" ? pageParam : 1
      const queryString = serializeListingRequest({
        search: search ?? "",
        tags: tags ?? [],
        categories: categories ?? [],
        sort: sort ?? null,
        page,
        limit,
      })
      const response = await fetch(`${endpoint}?${queryString}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`)
      }
      return response.json()
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasMore) return undefined
      return lastPage.page + 1
    },
    initialPageParam: 1,
    initialData: initialData
      ? {
          pages: [initialData as ListingResponse<T>],
          pageParams: [1],
        }
      : undefined,
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

  const allItems =
    query.data?.pages.flatMap((page: ListingResponse<T>) => page.items) ?? []

  return {
    ...query,
    allItems,
    sentinelRef,
  }
}

export function usePrefetchListing(options: UseListingQueryOptions) {
  const queryClient = useQueryClient()

  useEffect(() => {
    const {
      endpoint,
      locale,
      search,
      tags,
      categories,
      sort,
      limit = 12,
    } = options

    queryClient.prefetchInfiniteQuery({
      queryKey: [
        "listing",
        endpoint,
        locale,
        search,
        tags,
        categories,
        sort,
        limit,
      ],
      queryFn: async ({ pageParam = 1 }) => {
        const page = typeof pageParam === "number" ? pageParam : 1
        const queryString = serializeListingRequest({
          search: search ?? "",
          tags: tags ?? [],
          categories: categories ?? [],
          sort: sort ?? null,
          page,
          limit,
        })
        const response = await fetch(`${endpoint}?${queryString}`)
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`)
        }
        return response.json()
      },
      getNextPageParam: (lastPage: ListingResponse<BlogListingItem>) => {
        if (!lastPage.hasMore) return undefined
        return lastPage.page + 1
      },
      initialPageParam: 1,
    })
  }, [queryClient, options])
}
