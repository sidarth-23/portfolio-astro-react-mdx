"use client"

import { motion, AnimatePresence } from "motion/react"
import { useCallback, useState, type ComponentType } from "react"

import { SearchFilterBar } from "@/components/features/listing/listing-search-filter-bar"
import { Skeleton, Spinner } from "@/components/ui/react"
import { useListingQuery } from "@/hooks/use-listing-query"
import type { Locale } from "@/i18n/config"
import { t } from "@/i18n/ui"
import type { BlogListingItem, ListingResponse } from "@/lib/api/listing-api"
import type { ListingFilterState } from "@/lib/api/listing-query"
import { mergeListingFilters } from "@/lib/api/listing-query"

interface ItemListClientProps<T extends BlogListingItem> {
  endpoint: string
  locale: Locale
  tags: string[]
  categories: string[]
  initialFilters: ListingFilterState
  initialData?: ListingResponse<BlogListingItem>
  gridClassName: string
  skeletonCount: number
  CardComponent: ComponentType<{ item: T; locale: Locale }>
  getItemKey: (item: T) => string
}

const itemVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4, scale: 0.98 },
}

export function ItemListClient<T extends BlogListingItem>({
  endpoint,
  locale,
  tags,
  categories,
  initialFilters,
  initialData,
  gridClassName,
  skeletonCount,
  CardComponent,
  getItemKey,
}: ItemListClientProps<T>) {
  const [filters, setFilters] = useState<ListingFilterState>(initialFilters)
  const isInitialFilterState =
    filters.sort === initialFilters.sort &&
    filters.from === initialFilters.from &&
    filters.to === initialFilters.to &&
    filters.tags.length === initialFilters.tags.length &&
    filters.categories.length === initialFilters.categories.length &&
    filters.tags.every((tag) => initialFilters.tags.includes(tag)) &&
    filters.categories.every((category) =>
      initialFilters.categories.includes(category)
    )

  const {
    allItems,
    sentinelRef,
    isFetchingNextPage,
    hasNextPage,
    isPending,
    isFetching,
  } = useListingQuery<T>({
    endpoint,
    locale,
    tags: filters.tags,
    categories: filters.categories,
    sort: filters.sort,
    from: filters.from,
    to: filters.to,
    initialData: isInitialFilterState ? initialData : undefined,
    limit: 12,
  })

  const isLoadingFilters =
    isFetching && !isFetchingNextPage && allItems.length > 0

  const handleFiltersChange = useCallback((newFilters: ListingFilterState) => {
    setFilters(newFilters)

    const mergedSearch = mergeListingFilters(window.location.search, {
      search: "",
      ...newFilters,
    })
    window.history.replaceState({}, "", window.location.pathname + mergedSearch)
  }, [])

  return (
    <div>
      <SearchFilterBar
        locale={locale}
        tags={tags}
        categories={categories}
        initialFilters={initialFilters}
        onFiltersChange={handleFiltersChange}
      />

      {isPending && allItems.length === 0 ? (
        <div className={gridClassName}>
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={`skeleton-${i}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
            >
              <Skeleton className="h-100 w-full rounded-xl" />
            </motion.div>
          ))}
        </div>
      ) : allItems.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-12 text-center text-muted-foreground"
        >
          {t(locale, "filters.noResults")}
        </motion.p>
      ) : (
        <>
          <div className={`relative ${gridClassName}`}>
            <AnimatePresence mode="popLayout">
              {allItems.map((item) => (
                <motion.div
                  key={getItemKey(item)}
                  layout
                  variants={itemVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{
                    duration: 0.2,
                    ease: "easeOut",
                    layout: { duration: 0.25 },
                  }}
                >
                  <CardComponent item={item as T} locale={locale} />
                </motion.div>
              ))}
              {isFetchingNextPage &&
                Array.from({ length: skeletonCount }).map((_, i) => (
                  <motion.div
                    key={`skeleton-next-${i}`}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2, delay: i * 0.05 }}
                  >
                    <Skeleton className="h-100 w-full rounded-xl" />
                  </motion.div>
                ))}
            </AnimatePresence>

            <AnimatePresence>
              {isLoadingFilters && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-background/60 backdrop-blur-sm"
                >
                  <Spinner className="size-8" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {hasNextPage && <div ref={sentinelRef} className="mt-8 h-10" />}
        </>
      )}
    </div>
  )
}
