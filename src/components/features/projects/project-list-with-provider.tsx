"use client"

import { ProjectCard } from "@/components/features/projects/project-card"
import { ItemListWithProvider } from "@/components/listing/listing-item-list-with-provider"
import type { DehydratedState } from "@tanstack/react-query"
import type { Locale } from "@/i18n/config"
import type { SerializedProject } from "@/lib/api"

interface ProjectListWithProviderProps {
  dehydratedState: DehydratedState
  locale: Locale
  tags: string[]
  initialSearch: string
  initialTag: string | null
}

export function ProjectListWithProvider({
  dehydratedState,
  locale,
  tags,
  initialSearch,
  initialTag,
}: ProjectListWithProviderProps) {
  return (
    <ItemListWithProvider<SerializedProject>
      dehydratedState={dehydratedState}
      locale={locale}
      tags={tags}
      initialSearch={initialSearch}
      initialTag={initialTag}
      endpoint="/api/projects.json"
      gridClassName="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      skeletonCount={3}
      CardComponent={ProjectCard}
      getItemKey={(item) => item.slug}
    />
  )
}
