"use client"

import { useCallback, useState, type ComponentType } from "react"
import { motion, AnimatePresence } from "motion/react"
import { SearchFilterBar } from "@/components/listing/listing-search-filter-bar"
import { useListingQuery } from "@/hooks/use-listing-query"
import { Skeleton } from "@/components/ui/react"
import { Spinner } from "@/components/ui/react"
import type { Locale } from "@/i18n/config"
import { t } from "@/i18n/ui"
import type { BlogListingItem, ProjectListingItem, ListingResponse } from "@/lib/api/listing-api"

interface ItemListClientProps<T extends BlogListingItem | ProjectListingItem> {
  endpoint: string
  locale: Locale
  tags: string[]
  categories: string[]
  initialSearch: string
  initialTags: string[]
  initialCategories: string[]
  initialSortBy: string | null
  initialData?: ListingResponse<BlogListingItem> | ListingResponse<ProjectListingItem>
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

export function ItemListClient<T extends BlogListingItem | ProjectListingItem>({
  endpoint,
  locale,
  tags,
  categories,
  initialSearch,
  initialTags,
  initialCategories,
  initialSortBy,
  initialData,
  gridClassName,
  skeletonCount,
  CardComponent,
  getItemKey,
}: ItemListClientProps<T>) {
  const [search, setSearch] = useState(initialSearch)
  const [activeTags, setActiveTags] = useState<string[]>(initialTags)
  const [activeCategories, setActiveCategories] = useState<string[]>(initialCategories)
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title" | null>(
    initialSortBy as "newest" | "oldest" | "title" | null
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
    search,
    tags: activeTags,
    categories: activeCategories,
    sort: sortBy,
    initialData,
    limit: 12,
  })

  const isLoadingFilters =
    isFetching && !isFetchingNextPage && allItems.length > 0

  const handleFiltersChange = useCallback(
    (
      newSearch: string,
      newTags: string[],
      newCategories: string[],
      newSortBy: string | null
    ) => {
      setSearch(newSearch)
      setActiveTags(newTags)
      setActiveCategories(newCategories)
      setSortBy(newSortBy as "newest" | "oldest" | "title" | null)

      const url = new URL(window.location.href)
      if (newSearch) {
        url.searchParams.set("search", newSearch)
      } else {
        url.searchParams.delete("search")
      }
      if (newTags.length > 0) {
        url.searchParams.set("tags", newTags.join(","))
      } else {
        url.searchParams.delete("tags")
      }
      if (newCategories.length > 0) {
        url.searchParams.set("categories", newCategories.join(","))
      } else {
        url.searchParams.delete("categories")
      }
      if (newSortBy) {
        url.searchParams.set("sort", newSortBy)
      } else {
        url.searchParams.delete("sort")
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
        categories={categories}
        initialSearch={initialSearch}
        initialTags={initialTags}
        initialCategories={initialCategories}
        initialSortBy={initialSortBy}
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
                  transition={{ duration: 0.2, ease: "easeOut" }}
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
