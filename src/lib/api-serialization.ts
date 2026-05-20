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
    slug: post.slug.split("/").slice(1).join("/"),
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
    slug: project.slug.split("/").slice(1).join("/"),
    title: project.data.title,
    summary: project.data.summary,
    date: project.data.date.toISOString(),
    updatedDate: project.data.updatedDate?.toISOString(),
    featured: project.data.featured,
    status: project.data.status,
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

export function filterByTag<T extends { tags: string[] }>(
  items: T[],
  tag: string | null
): T[] {
  if (!tag || tag.trim() === "") return items
  return items.filter((item) => item.tags.includes(tag))
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
