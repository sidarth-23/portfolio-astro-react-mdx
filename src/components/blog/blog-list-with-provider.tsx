"use client"

import { BlogCard } from "./blog-card"
import { ItemListWithProvider } from "@/components/shared/item-list-with-provider"
import type { DehydratedState } from "@tanstack/react-query"
import type { Locale } from "@/i18n/config"
import type { SerializedBlogPost } from "@/lib/api-serialization"

interface BlogListWithProviderProps {
  dehydratedState: DehydratedState
  locale: Locale
  tags: string[]
  initialSearch: string
  initialTag: string | null
}

export function BlogListWithProvider({
  dehydratedState,
  locale,
  tags,
  initialSearch,
  initialTag,
}: BlogListWithProviderProps) {
  return (
    <ItemListWithProvider<SerializedBlogPost>
      dehydratedState={dehydratedState}
      locale={locale}
      tags={tags}
      initialSearch={initialSearch}
      initialTag={initialTag}
      endpoint="/api/blog.json"
      gridClassName="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      skeletonCount={4}
      CardComponent={BlogCard}
      getItemKey={(item) => item.slug}
    />
  )
}
