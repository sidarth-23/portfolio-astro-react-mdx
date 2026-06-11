import type { Locale } from "@/i18n/config"
import { t } from "@/i18n/ui"

export type ImageLike = {
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
  tags: string[]
  coverImage: ImageLike
  readMoreLabel: string
}

export function createBlogCardView(input: {
  locale: Locale
  slug: string
  title: string
  category?: string
  formattedDate: string
  description: string
  tags: string[]
  coverImage: ImageLike
}): BlogCardView {
  return {
    href: `/${input.locale}/blog/${input.slug}`,
    title: input.title,
    category: input.category,
    formattedDate: input.formattedDate,
    description: input.description,
    tags: input.tags,
    coverImage: input.coverImage,
    readMoreLabel: t(input.locale, "blog.readMore"),
  }
}
