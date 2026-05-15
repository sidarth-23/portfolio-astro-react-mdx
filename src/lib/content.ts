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

export function formatDate(date: Date, locale: Locale = "en"): string {
  const localeMap: Record<Locale, string> = {
    en: "en-US",
    es: "es-ES",
    fr: "fr-FR",
  }
  return new Intl.DateTimeFormat(localeMap[locale], {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

export function formatShortDate(date: Date, locale: Locale = "en"): string {
  const localeMap: Record<Locale, string> = {
    en: "en-US",
    es: "es-ES",
    fr: "fr-FR",
  }
  return new Intl.DateTimeFormat(localeMap[locale], {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

export function estimateReadingTime(body: string): number {
  // Strip fenced code blocks
  const withoutCodeBlocks = body.replace(/```[\s\S]*?```/g, "")
  // Strip inline code
  const withoutInlineCode = withoutCodeBlocks.replace(/`[^`]*`/g, "")
  // Strip HTML tags
  const withoutHtml = withoutInlineCode.replace(/<[^>]*>/g, "")
  // Strip markdown headings, bold, italic, links, images
  const withoutMarkdown = withoutHtml
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_]{1,2}/g, "")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]*)\]\[[^\]]*\]/g, "$1")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/\|/g, " ")
  // Count words
  const words = withoutMarkdown
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0)
  const minutes = Math.ceil(words.length / 200)
  return Math.max(minutes, 1)
}
