"use client"

import { BlogCard } from "./blog-card"
import { ItemListClient } from "@/components/shared/item-list-client"
import type { Locale } from "@/i18n/config"
import type { SerializedBlogPost } from "@/lib/api-serialization"

interface BlogListClientProps {
  locale: Locale
  tags: string[]
  initialSearch: string
  initialTag: string | null
}

export function BlogListClient({
  locale,
  tags,
  initialSearch,
  initialTag,
}: BlogListClientProps) {
  return (
    <ItemListClient<SerializedBlogPost>
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
