"use client"

import { ItemListClient } from "@/components/features/listing/listing-item-list-client"
import { QueryProvider } from "@/components/providers/query-provider"
import type { Locale } from "@/i18n/config"
import type { BlogListingItem, ListingResponse } from "@/lib/api/listing-api"
import type { ListingFilterState } from "@/lib/api/listing-query"

import type { ComponentType } from "react"

interface ItemListWithProviderProps<T extends BlogListingItem> {
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
export function ItemListWithProvider<T extends BlogListingItem>({
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
}: ItemListWithProviderProps<T>) {
  return (
    <QueryProvider>
      <ItemListClient<T>
        endpoint={endpoint}
        locale={locale}
        tags={tags}
        categories={categories}
        initialFilters={initialFilters}
        initialData={initialData}
        gridClassName={gridClassName}
        skeletonCount={skeletonCount}
        CardComponent={CardComponent}
        getItemKey={getItemKey}
      />
    </QueryProvider>
  )
}
