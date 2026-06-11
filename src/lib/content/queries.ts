import { getCollection, type CollectionEntry } from "astro:content"

import { locales, type Locale } from "@/i18n/config"
import type { tagSchema } from "@/lib/schemas"

import type { z } from "astro/zod"

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
): CollectionEntry<"blog">[] {
  return entries.filter((entry) => {
    const entryLocale = entry.data.locale ?? getLocaleFromSlug(entry.id)
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
    const entrySlug = getContentSlug(entry.id)
    const entryLocale = entry.data.locale ?? getLocaleFromSlug(entry.id)
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

export async function getFeaturedBlogPosts(locale: Locale = "en") {
  const posts = await getCollection(
    "blog",
    ({ data }) => data.featured && !data.draft
  )
  return filterByLocale(posts, locale).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime()
  )
}

export async function getProfileExperienceByLocale(locale: Locale = "en") {
  const entries = await getCollection("profileExperience")

  const grouped = new Map<
    string,
    {
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
          details: string
        }>
      }
    }
  >()

  for (const entry of entries) {
    if (entry.data.locale !== locale) continue
    const key = `${entry.data.locale}-${entry.data.id}-${entry.data.company}`
    const existing = grouped.get(key)
    const role = {
      ...entry.data.role,
      details: (entry.body ?? "").trim(),
    }

    if (existing) {
      existing.data.roles.push(role)
      continue
    }

    grouped.set(key, {
      data: {
        id: entry.data.id,
        locale: entry.data.locale,
        company: entry.data.company,
        location: entry.data.companyLocation,
        roles: [role],
      },
    })
  }

  return Array.from(grouped.values())
    .filter((entry) => entry.data.locale === locale)
    .map((entry) => ({
      ...entry,
      data: {
        ...entry.data,
        roles: [...entry.data.roles].sort((a, b) =>
          a.start < b.start ? -1 : a.start > b.start ? 1 : 0
        ),
      },
    }))
    .sort((a, b) => a.data.id - b.data.id)
}

export function getAllCategories(posts: CollectionEntry<"blog">[]): string[] {
  const categories = new Set<string>()
  for (const post of posts) {
    if (post.data.category) {
      categories.add(post.data.category)
    }
  }
  return Array.from(categories).sort()
}
