import type { Locale } from "@/i18n/config"

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
  }
}
