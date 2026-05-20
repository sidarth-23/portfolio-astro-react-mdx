import { getCollection, type CollectionEntry } from "astro:content"
import type { z } from "zod"
import type { tagSchema } from "@/lib/schemas"
import { locales, type Locale } from "@/i18n/config"

type Tag = z.infer<typeof tagSchema>

function getLocaleFromSlug(slug: string): Locale {
  const firstSegment = slug.split("/")[0]
  if (locales.includes(firstSegment as Locale)) {
    return firstSegment as Locale
  }
  return "en"
}

function getContentSlug(slug: string): string {
  const parts = slug.split("/")
  if (locales.includes(parts[0] as Locale)) {
    return parts.slice(1).join("/")
  }
  return slug
}

function filterByLocale(
  entries: CollectionEntry<"blog">[],
  locale: Locale
): CollectionEntry<"blog">[]
function filterByLocale(
  entries: CollectionEntry<"projects">[],
  locale: Locale
): CollectionEntry<"projects">[]
function filterByLocale(
  entries: (CollectionEntry<"blog"> | CollectionEntry<"projects">)[],
  locale: Locale
): (CollectionEntry<"blog"> | CollectionEntry<"projects">)[] {
  return entries.filter((entry) => {
    const entryLocale = entry.data.locale ?? getLocaleFromSlug(entry.slug)
    return entryLocale === locale
  })
}

export async function getPublishedBlogPosts(locale: Locale = "en") {
  const posts = await getCollection("blog", ({ data }) => !data.draft)
  const filtered = filterByLocale(posts, locale)
  return filtered.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
}

export async function getDraftBlogPosts(locale: Locale = "en") {
  const posts = await getCollection("blog", ({ data }) => data.draft)
  return filterByLocale(posts, locale)
}

export async function getBlogPostBySlug(slug: string, locale: Locale = "en") {
  const posts = await getCollection("blog", (entry) => {
    const entrySlug = getContentSlug(entry.slug)
    const entryLocale = entry.data.locale ?? getLocaleFromSlug(entry.slug)
    return entrySlug === slug && entryLocale === locale && !entry.data.draft
  })
  return posts[0] ?? null
}

export async function getBlogPostsByTag(tag: Tag, locale: Locale = "en") {
  const posts = await getCollection("blog", ({ data }) =>
    data.tags.includes(tag)
  )
  const filtered = filterByLocale(posts, locale)
  return filtered.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
}

export function getAllTags(posts: CollectionEntry<"blog">[]): Tag[] {
  const tags = new Set<Tag>()
  for (const post of posts) {
    for (const tag of post.data.tags) {
      tags.add(tag)
    }
  }
  return Array.from(tags).sort()
}

export async function getFeaturedProjects(locale: Locale = "en") {
  const projects = await getCollection("projects", ({ data }) => data.featured)
  return filterByLocale(projects, locale).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime()
  )
}

export async function getAllProjects(locale: Locale = "en") {
  const projects = await getCollection("projects")
  return filterByLocale(projects, locale).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime()
  )
}

export async function getProjectBySlug(slug: string, locale: Locale = "en") {
  const projects = await getCollection("projects", (entry) => {
    const entrySlug = getContentSlug(entry.slug)
    const entryLocale = entry.data.locale ?? getLocaleFromSlug(entry.slug)
    return entrySlug === slug && entryLocale === locale
  })
  return projects[0] ?? null
}

export async function getProjectsByTag(tag: Tag, locale: Locale = "en") {
  const projects = await getCollection("projects", ({ data }) =>
    data.tags.includes(tag)
  )
  const filtered = filterByLocale(projects, locale)
  return filtered.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
}

export async function getCvByLocale(
  locale: Locale = "en"
): Promise<CollectionEntry<"cv"> | null> {
  const entries = await getCollection("cv")
  const entry = entries.find((item) => item.data.locale === locale)
  return entry ?? null
}

export async function getCvExperienceByLocale(locale: Locale = "en") {
  const entries = (await getCollection("cvExperience" as never)) as Array<{
    data: {
      id: number
      locale: Locale
      company: string
      location: string
      roles: Array<{
        title: string
        location?: string
        start: string
        end?: string | null
        currentlyWorking: boolean
        highlights: string[]
      }>
    }
    render: () => Promise<{ Content: unknown; headings: unknown[] }>
  }>

  return entries
    .filter((entry) => entry.data.locale === locale)
    .sort((a, b) => a.data.id - b.data.id)
}

export function getAllProjectTags(
  projects: CollectionEntry<"projects">[]
): Tag[] {
  const tags = new Set<Tag>()
  for (const project of projects) {
    for (const tag of project.data.tags) {
      tags.add(tag)
    }
  }
  return Array.from(tags).sort()
}

export function getAllCategories(
  posts: CollectionEntry<"blog">[]
): string[] {
  const categories = new Set<string>()
  for (const post of posts) {
    if (post.data.category) {
      categories.add(post.data.category)
    }
  }
  return Array.from(categories).sort()
}

export function getAllProjectCategories(
  projects: CollectionEntry<"projects">[]
): string[] {
  const categories = new Set<string>()
  for (const project of projects) {
    if (project.data.category) {
      categories.add(project.data.category)
    }
  }
  return Array.from(categories).sort()
}
