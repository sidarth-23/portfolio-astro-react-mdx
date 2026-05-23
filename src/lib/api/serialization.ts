import { getImage } from "astro:assets"
import type { CollectionEntry } from "astro:content"

export interface SerializedImage {
  src: string
  width: number
  height: number
}

export interface SerializedBlogPost {
  slug: string
  title: string
  description: string
  date: string
  updatedDate?: string
  category?: string
  tags: string[]
  coverImage: SerializedImage
}

export interface SerializedProject {
  slug: string
  title: string
  summary: string
  date: string
  updatedDate?: string
  featured: boolean
  status: string
  category?: string
  tags: string[]
  coverImage: SerializedImage
}

export interface PaginatedResponse<T> {
  items: T[]
  hasMore: boolean
  total: number
}

export async function serializeBlogPost(
  post: CollectionEntry<"blog">
): Promise<SerializedBlogPost> {
  const optimizedImage = await getImage({
    src: post.data.coverImage,
    width: 600,
    height: 340,
    format: "webp",
    quality: 80,
  })

  return {
    slug: post.id.split("/").slice(1).join("/"),
    title: post.data.title,
    description: post.data.description,
    date: post.data.date.toISOString(),
    updatedDate: post.data.updatedDate?.toISOString(),
    category: post.data.category,
    tags: post.data.tags,
    coverImage: {
      src: optimizedImage.src,
      width: optimizedImage.attributes.width ?? 600,
      height: optimizedImage.attributes.height ?? 340,
    },
  }
}

export async function serializeProject(
  project: CollectionEntry<"projects">
): Promise<SerializedProject> {
  const optimizedImage = await getImage({
    src: project.data.coverImage,
    width: 600,
    height: 340,
    format: "webp",
    quality: 80,
  })

  return {
    slug: project.id.split("/").slice(1).join("/"),
    title: project.data.title,
    summary: project.data.summary,
    date: project.data.date.toISOString(),
    updatedDate: project.data.updatedDate?.toISOString(),
    featured: project.data.featured,
    status: project.data.status,
    category: project.data.category,
    tags: project.data.tags,
    coverImage: {
      src: optimizedImage.src,
      width: optimizedImage.attributes.width ?? 600,
      height: optimizedImage.attributes.height ?? 340,
    },
  }
}

export function filterBySearch<T extends { title: string }>(
  items: T[],
  search: string | null
): T[] {
  if (!search || search.trim() === "") return items

  const query = search.toLowerCase().trim()
  return items.filter(
    (item) =>
      item.title.toLowerCase().includes(query) ||
      ("description" in item &&
        (item as unknown as { description: string }).description
          .toLowerCase()
          .includes(query)) ||
      ("summary" in item &&
        (item as unknown as { summary: string }).summary
          .toLowerCase()
          .includes(query))
  )
}

export function filterByTags<T extends { tags: string[] }>(
  items: T[],
  tags: string[] | null
): T[] {
  if (!tags || tags.length === 0) return items
  return items.filter((item) => tags.some((tag) => item.tags.includes(tag)))
}

export function filterByCategories<T extends { category?: string }>(
  items: T[],
  categories: string[] | null
): T[] {
  if (!categories || categories.length === 0) return items
  return items.filter(
    (item) => item.category && categories.includes(item.category)
  )
}

export type SortMode = "newest" | "oldest" | "title"

export function sortItems<T extends { date: string; title: string }>(
  items: T[],
  sort: SortMode | null
): T[] {
  if (!sort || sort === "newest") {
    return [...items].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  }
  if (sort === "oldest") {
    return [...items].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )
  }
  if (sort === "title") {
    return [...items].sort((a, b) => a.title.localeCompare(b.title))
  }
  return items
}

export function paginate<T>(
  items: T[],
  page: number,
  limit: number
): { items: T[]; hasMore: boolean; total: number } {
  const start = (page - 1) * limit
  const end = start + limit
  const paginatedItems = items.slice(start, end)

  return {
    items: paginatedItems,
    hasMore: end < items.length,
    total: items.length,
  }
}
