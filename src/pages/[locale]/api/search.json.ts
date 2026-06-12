import searchExports from "@/generated/search.json"
import { locales, type Locale } from "@/i18n/config"
import {
  importSearchIndex,
  searchFlexSearchIndex,
  type SearchIndexExport,
} from "@/lib/search/flexsearch"

import type { APIRoute } from "astro"

export const prerender = false

const exportMap = searchExports as Record<Locale, SearchIndexExport>
const searchCache = new Map<Locale, ReturnType<typeof importSearchIndex>>()

function getSearchIndex(locale: Locale) {
  const cached = searchCache.get(locale)
  if (cached) return cached

  const raw = exportMap[locale]
  if (!raw) {
    throw new Error(`Missing search export for locale: ${locale}`)
  }

  const index = importSearchIndex(raw)
  searchCache.set(locale, index)
  return index
}

export const GET: APIRoute = async ({ params, url }) => {
  const locale = params.locale as Locale
  if (!locales.includes(locale)) {
    return new Response("Not found", { status: 404 })
  }

  const query = url.searchParams.get("q")?.trim() ?? ""
  if (query.length < 2) {
    return Response.json({ results: [] })
  }

  const limit = Number(url.searchParams.get("limit") ?? "8")
  const index = getSearchIndex(locale)
  const results = await searchFlexSearchIndex(
    index,
    query,
    Number.isFinite(limit) ? limit : 8
  )

  return Response.json({ results })
}
