import { getPublishedBlogPosts, getAllProjects } from "@/lib/content/queries"
import {
  serializeBlogPost,
  serializeProject,
  filterBySearch,
  filterByTags,
  filterByCategories,
  sortItems,
  paginate,
} from "@/lib/api"
import type { Locale } from "@/i18n/config"
import type {
  PaginatedResponse,
  SerializedBlogPost,
  SerializedProject,
  SortMode,
} from "@/lib/api"

export async function fetchBlogPage(
  locale: Locale,
  tags: string[] | null,
  categories: string[] | null,
  search: string | null,
  sort: SortMode | null,
  page: number,
  limit: number
): Promise<PaginatedResponse<SerializedBlogPost>> {
  const posts = await getPublishedBlogPosts(locale)
  const serializedPosts = await Promise.all(posts.map(serializeBlogPost))
  let filtered = filterByTags(serializedPosts, tags)
  filtered = filterByCategories(filtered, categories)
  filtered = filterBySearch(filtered, search)
  filtered = sortItems(filtered, sort)
  return paginate(filtered, page, limit)
}

export async function fetchProjectPage(
  locale: Locale,
  tags: string[] | null,
  categories: string[] | null,
  search: string | null,
  sort: SortMode | null,
  page: number,
  limit: number
): Promise<PaginatedResponse<SerializedProject>> {
  const projects = await getAllProjects(locale)
  const serializedProjects = await Promise.all(projects.map(serializeProject))
  let filtered = filterByTags(serializedProjects, tags)
  filtered = filterByCategories(filtered, categories)
  filtered = filterBySearch(filtered, search)
  filtered = sortItems(filtered, sort)
  return paginate(filtered, page, limit)
}
