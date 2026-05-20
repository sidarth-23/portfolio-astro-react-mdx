import { getPublishedBlogPosts, getAllProjects } from "@/lib/content"
import {
  serializeBlogPost,
  serializeProject,
  filterBySearch,
  filterByTag,
  paginate,
} from "@/lib/api-serialization"
import type { Locale } from "@/i18n/config"
import type {
  PaginatedResponse,
  SerializedBlogPost,
  SerializedProject,
} from "@/lib/api-serialization"

export async function fetchBlogPage(
  locale: Locale,
  tag: string | null,
  search: string | null,
  page: number,
  limit: number
): Promise<PaginatedResponse<SerializedBlogPost>> {
  const posts = await getPublishedBlogPosts(locale)
  const serializedPosts = await Promise.all(posts.map(serializeBlogPost))
  let filtered = filterByTag(serializedPosts, tag)
  filtered = filterBySearch(filtered, search)
  return paginate(filtered, page, limit)
}

export async function fetchProjectPage(
  locale: Locale,
  tag: string | null,
  search: string | null,
  page: number,
  limit: number
): Promise<PaginatedResponse<SerializedProject>> {
  const projects = await getAllProjects(locale)
  const serializedProjects = await Promise.all(projects.map(serializeProject))
  let filtered = filterByTag(serializedProjects, tag)
  filtered = filterBySearch(filtered, search)
  return paginate(filtered, page, limit)
}
