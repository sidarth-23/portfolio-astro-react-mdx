"use client"

import { ProjectCard } from "@/components/features/projects/project-card"
import { ItemListWithProvider } from "@/components/listing/listing-item-list-with-provider"
import type { Locale } from "@/i18n/config"
import type { SerializedProject } from "@/lib/api"

interface ProjectListWithProviderProps {
  allProjects: SerializedProject[]
  locale: Locale
  tags: string[]
  categories: string[]
  initialSearch: string
  initialTags: string[]
  initialCategories: string[]
  initialSortBy: string | null
}

export function ProjectListWithProvider({
  allProjects,
  locale,
  tags,
  categories,
  initialSearch,
  initialTags,
  initialCategories,
  initialSortBy,
}: ProjectListWithProviderProps) {
  return (
    <ItemListWithProvider<SerializedProject>
      allItems={allProjects}
      locale={locale}
      tags={tags}
      categories={categories}
      initialSearch={initialSearch}
      initialTags={initialTags}
      initialCategories={initialCategories}
      initialSortBy={initialSortBy}
      gridClassName="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      skeletonCount={3}
      CardComponent={ProjectCard}
      getItemKey={(item) => item.slug}
    />
  )
}
