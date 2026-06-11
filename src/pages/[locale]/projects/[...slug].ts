import { defaultLocale, isValidLocale } from "@/i18n/config"

import type { APIRoute } from "astro"

export const prerender = false

// Legacy /projects URLs: these write-ups now live in the blog collection.
const convertedSlugs = new Set([
  "bluebook-insights-analytics-platform",
  "elecsavers-ecommerce-platform",
  "pranaav-enterprises-corporate-website",
  "vignesh-dental-clinic-web-experience",
])

export const GET: APIRoute = ({ params, redirect }) => {
  const locale =
    params.locale && isValidLocale(params.locale)
      ? params.locale
      : defaultLocale
  const slug = params.slug ?? ""

  if (convertedSlugs.has(slug)) {
    return redirect(`/${locale}/blog/${slug}`, 301)
  }

  return redirect(`/${locale}/blog`, 301)
}
