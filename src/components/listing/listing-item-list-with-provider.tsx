"use client"

import { ItemListClient } from "@/components/listing/listing-item-list-client"
import { QueryProvider } from "@/components/providers/query-provider"
import type { Locale } from "@/i18n/config"
import type { ComponentType } from "react"

interface ItemListWithProviderProps<T> {
  allItems: T[]
  locale: Locale
  tags: string[]
  categories: string[]
  initialSearch: string
  initialTags: string[]
  initialCategories: string[]
  initialSortBy: string | null
  gridClassName: string
  skeletonCount: number
  CardComponent: ComponentType<{ item: T; locale: Locale }>
  getItemKey: (item: T) => string
}

export function ItemListWithProvider<T>({
  allItems,
  locale,
  tags,
  categories,
  initialSearch,
  initialTags,
  initialCategories,
  initialSortBy,
  gridClassName,
  skeletonCount,
  CardComponent,
  getItemKey,
}: ItemListWithProviderProps<T>) {
  return (
    <QueryProvider>
      <ItemListClient
        allItems={allItems}
        locale={locale}
        tags={tags}
        categories={categories}
        initialSearch={initialSearch}
        initialTags={initialTags}
        initialCategories={initialCategories}
        initialSortBy={initialSortBy}
        gridClassName={gridClassName}
        skeletonCount={skeletonCount}
        CardComponent={CardComponent}
        getItemKey={getItemKey}
      />
    </QueryProvider>
  )
}
