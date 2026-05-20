import type { Locale } from "@/i18n/config"
import { t } from "@/i18n/ui"

type ImageLike = {
  src: string
  width?: number
  height?: number
}

export type BlogCardView = {
  href: string
  title: string
  category?: string
  formattedDate: string
  description: string
  coverImage: ImageLike
  readMoreLabel: string
}

export type ProjectCardView = {
  href: string
  title: string
  featured: boolean
  featuredLabel: string
  formattedDate: string
  summary: string
  tags: string[]
  coverImage: ImageLike
}

export function createBlogCardView(input: {
  locale: Locale
  slug: string
  title: string
  category?: string
  formattedDate: string
  description: string
  coverImage: ImageLike
}): BlogCardView {
  return {
    href: `/${input.locale}/blog/${input.slug}`,
    title: input.title,
    category: input.category,
    formattedDate: input.formattedDate,
    description: input.description,
    coverImage: input.coverImage,
    readMoreLabel: t(input.locale, "blog.readMore"),
  }
}

export function createProjectCardView(input: {
  locale: Locale
  slug: string
  title: string
  featured: boolean
  formattedDate: string
  summary: string
  tags: string[]
  coverImage: ImageLike
}): ProjectCardView {
  return {
    href: `/${input.locale}/projects/${input.slug}`,
    title: input.title,
    featured: input.featured,
    featuredLabel: t(input.locale, "projects.featuredLabel"),
    formattedDate: input.formattedDate,
    summary: input.summary,
    tags: input.tags,
    coverImage: input.coverImage,
  }
}
