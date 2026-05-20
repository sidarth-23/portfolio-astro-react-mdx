"use client"

import { ProjectCard } from "./project-card"
import { ItemListClient } from "@/components/shared/item-list-client"
import type { Locale } from "@/i18n/config"
import type { SerializedProject } from "@/lib/api-serialization"

interface ProjectListClientProps {
  locale: Locale
  tags: string[]
  initialSearch: string
  initialTag: string | null
}

export function ProjectListClient({
  locale,
  tags,
  initialSearch,
  initialTag,
}: ProjectListClientProps) {
  return (
    <ItemListClient<SerializedProject>
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
