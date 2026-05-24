import type { Locale } from "@/i18n/config"
import type { CollectionEntry } from "astro:content"

export interface SeoData {
  title: string
  description: string
  ogImage: string
  ogType: "article" | "website"
  ogLocale: string
  publishedTime?: string
  modifiedTime?: string
  canonicalUrl: string
  twitterCard: "summary_large_image"
}

export type ContentEntry = CollectionEntry<"blog"> | CollectionEntry<"projects">

export function resolveContentSeo(
  entry: ContentEntry,
  type: "blog" | "projects",
  locale: Locale,
  siteUrl: string
): SeoData {
  const seo = entry.data.seo
  const slug = entry.id.split("/").slice(1).join("/")
  const coverImageSrc =
    type === "blog"
      ? (entry.data as CollectionEntry<"blog">["data"]).coverImage.src
      : (entry.data as CollectionEntry<"projects">["data"]).coverImage.src

  return {
    title: `${seo.title} | Sidarth G`,
    description: seo.description,
    ogImage: `${siteUrl}${coverImageSrc}`,
    ogType: type === "blog" ? "article" : "website",
    ogLocale: locale,
    publishedTime: entry.data.date.toISOString(),
    modifiedTime: entry.data.updatedDate?.toISOString(),
    canonicalUrl: `${siteUrl}/${locale}/${type}/${slug}`,
    twitterCard: "summary_large_image",
  }
}

export function resolvePageSeo(
  title: string,
  description: string,
  ogImage: string,
  ogType: "article" | "website",
  locale: Locale,
  siteUrl: string,
  path: string
): SeoData {
  return {
    title: `${title} | Sidarth G`,
    description,
    ogImage,
    ogType,
    ogLocale: locale,
    canonicalUrl: `${siteUrl}${path}`,
    twitterCard: "summary_large_image",
  }
}
