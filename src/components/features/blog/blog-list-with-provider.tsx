"use client"

import { BlogCard } from "@/components/features/blog/blog-card"
import { ItemListWithProvider } from "@/components/listing/listing-item-list-with-provider"
import type { DehydratedState } from "@tanstack/react-query"
import type { Locale } from "@/i18n/config"
import type { SerializedBlogPost } from "@/lib/api"

interface BlogListWithProviderProps {
  dehydratedState: DehydratedState
  locale: Locale
  tags: string[]
  categories: string[]
  initialSearch: string
  initialTags: string[]
  initialCategories: string[]
  initialSortBy: string | null
}

export function BlogListWithProvider({
  dehydratedState,
  locale,
  tags,
  categories,
  initialSearch,
  initialTags,
  initialCategories,
  initialSortBy,
}: BlogListWithProviderProps) {
  return (
    <ItemListWithProvider<SerializedBlogPost>
      dehydratedState={dehydratedState}
      locale={locale}
      tags={tags}
      categories={categories}
      initialSearch={initialSearch}
      initialTags={initialTags}
      initialCategories={initialCategories}
      initialSortBy={initialSortBy}
      endpoint="/api/blog.json"
      gridClassName="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      skeletonCount={4}
      CardComponent={BlogCard}
      getItemKey={(item) => item.slug}
    />
  )
}