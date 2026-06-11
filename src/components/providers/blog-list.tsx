"use client"

import { BlogCard } from "@/components/features/blog/blog-card"
import { ItemListWithProvider } from "@/components/providers/listing-item-list"
import type { Locale } from "@/i18n/config"
import type { BlogListingItem, ListingResponse } from "@/lib/api/listing-api"
import type { ListingSort } from "@/lib/api/listing-query"

interface BlogListWithProviderProps {
  locale: Locale
  tags: string[]
  categories: string[]
  initialSearch: string
  initialTags: string[]
  initialCategories: string[]
  initialSortBy: ListingSort | null
  initialData?: ListingResponse<BlogListingItem>
}

export function BlogListWithProvider({
  locale,
  tags,
  categories,
  initialSearch,
  initialTags,
  initialCategories,
  initialSortBy,
  initialData,
}: BlogListWithProviderProps) {
  return (
    <ItemListWithProvider<BlogListingItem>
      endpoint={`/${locale}/api/blog.json`}
      locale={locale}
      tags={tags}
      categories={categories}
      initialSearch={initialSearch}
      initialTags={initialTags}
      initialCategories={initialCategories}
      initialSortBy={initialSortBy}
      initialData={initialData}
      gridClassName="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      skeletonCount={4}
      CardComponent={BlogCard}
      getItemKey={(item) => item.slug}
    />
  )
}
