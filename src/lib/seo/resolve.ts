import type { Locale } from "@/i18n/config"

import { buildContentOgFilename } from "./content-og"

import type { CollectionEntry } from "astro:content"

export const SITE_NAME = "Sidarth G"

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

export type ContentEntry = CollectionEntry<"blog">

function normalizeSiteUrl(siteUrl: string): string {
  return siteUrl.replace(/\/+$/, "")
}

function collapsePathSlashes(pathname: string): string {
  return pathname.replace(/\/{2,}/g, "/")
}

function buildAbsoluteUrl(siteUrl: string, path: string): string {
  const normalizedSite = normalizeSiteUrl(siteUrl)
  const url = new URL(path, `${normalizedSite}/`)
  url.pathname = collapsePathSlashes(url.pathname)
  return url.toString()
}

function normalizeAbsoluteUrl(urlString: string): string {
  const url = new URL(urlString)
  url.pathname = collapsePathSlashes(url.pathname)
  return url.toString()
}

export function resolveContentSeo(
  entry: ContentEntry,
  type: "blog",
  locale: Locale,
  siteUrl: string
): SeoData {
  const seo = entry.data.seo
  const slug = entry.id.split("/").slice(1).join("/")
  const ogFilename = buildContentOgFilename(type, locale, slug)

  return {
    title: `${seo.title} | ${SITE_NAME}`,
    description: seo.description,
    ogImage: buildAbsoluteUrl(siteUrl, `/og/${ogFilename}`),
    ogType: type === "blog" ? "article" : "website",
    ogLocale: locale,
    publishedTime: entry.data.date.toISOString(),
    modifiedTime: entry.data.updatedDate?.toISOString(),
    canonicalUrl: buildAbsoluteUrl(siteUrl, `/${locale}/${type}/${slug}`),
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
  path: string,
  appendSiteName = true
): SeoData {
  return {
    title: appendSiteName ? `${title} | ${SITE_NAME}` : title,
    description,
    ogImage: normalizeAbsoluteUrl(ogImage),
    ogType,
    ogLocale: locale,
    canonicalUrl: buildAbsoluteUrl(siteUrl, path),
    twitterCard: "summary_large_image",
  }
}
