"use client"

import { ProjectCard } from "@/components/features/projects/project-card"
import { ItemListWithProvider } from "@/components/providers/listing-item-list"
import type { Locale } from "@/i18n/config"
import type { ProjectListingItem, ListingResponse } from "@/lib/api/listing-api"
import type { ListingSort } from "@/lib/api/listing-query"

interface ProjectListWithProviderProps {
  locale: Locale
  tags: string[]
  categories: string[]
  initialSearch: string
  initialTags: string[]
  initialCategories: string[]
  initialSortBy: ListingSort | null
  initialData?: ListingResponse<ProjectListingItem>
}

export function ProjectListWithProvider({
  locale,
  tags,
  categories,
  initialSearch,
  initialTags,
  initialCategories,
  initialSortBy,
  initialData,
}: ProjectListWithProviderProps) {
  return (
    <ItemListWithProvider<ProjectListingItem>
      endpoint={`/${locale}/api/projects.json`}
      locale={locale}
      tags={tags}
      categories={categories}
      initialSearch={initialSearch}
      initialTags={initialTags}
      initialCategories={initialCategories}
      initialSortBy={initialSortBy}
      initialData={initialData}
      gridClassName="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      skeletonCount={3}
      CardComponent={ProjectCard}
      getItemKey={(item) => item.slug}
    />
  )
}
