"use client"

import { useCallback, useState, type ComponentType } from "react"
import { SearchFilterBar } from "@/components/shared/search-filter-bar"
import { useInfiniteItems } from "@/hooks/use-infinite-items"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import type { Locale } from "@/i18n/config"
import { t } from "@/i18n/ui"

interface ItemListClientProps<T> {
  locale: Locale
  tags: string[]
  initialSearch: string
  initialTag: string | null
  endpoint: string
  gridClassName: string
  skeletonCount: number
  CardComponent: ComponentType<{ item: T; locale: Locale }>
  getItemKey: (item: T) => string
}

export function ItemListClient<T>({
  locale,
  tags,
  initialSearch,
  initialTag,
  endpoint,
  gridClassName,
  skeletonCount,
  CardComponent,
  getItemKey,
}: ItemListClientProps<T>) {
  const [search, setSearch] = useState(initialSearch)
  const [activeTag, setActiveTag] = useState<string | null>(initialTag)

  const {
    allItems,
    sentinelRef,
    isFetchingNextPage,
    hasNextPage,
    isPending,
    isFetching,
  } = useInfiniteItems<T>({
    endpoint,
    locale,
    tag: activeTag,
    search,
    limit: 12,
  })

  const handleFiltersChange = useCallback(
    (newSearch: string, newTag: string | null) => {
      setSearch(newSearch)
      setActiveTag(newTag)

      const url = new URL(window.location.href)
      if (newSearch) {
        url.searchParams.set("search", newSearch)
      } else {
        url.searchParams.delete("search")
      }
      if (newTag) {
        url.searchParams.set("tag", newTag)
      } else {
        url.searchParams.delete("tag")
      }
      window.history.replaceState({}, "", url)
    },
    []
  )

  return (
    <div>
      <SearchFilterBar
        locale={locale}
        tags={tags}
        initialSearch={initialSearch}
        initialTag={initialTag}
        onFiltersChange={handleFiltersChange}
      />

      {isPending ? (
        <div className={gridClassName}>
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={`skeleton-${i}`} className="h-[400px] w-full rounded-xl" />
          ))}
        </div>
      ) : allItems.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          {t(locale, "filters.noResults")}
        </p>
      ) : (
        <>
          <div className={`relative ${gridClassName}`}>
            {isFetching && !isFetchingNextPage && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-sm rounded-xl">
                <Spinner className="size-8" />
              </div>
            )}
            {allItems.map((item) => (
              <CardComponent
                key={getItemKey(item)}
                item={item}
                locale={locale}
              />
            ))}
            {isFetchingNextPage &&
              Array.from({ length: skeletonCount }).map((_, i) => (
                <Skeleton key={`skeleton-${i}`} className="h-[400px] w-full rounded-xl" />
              ))}
          </div>

          {hasNextPage && (
            <div ref={sentinelRef} className="h-10 mt-8" />
          )}
        </>
      )}
    </div>
  )
}
