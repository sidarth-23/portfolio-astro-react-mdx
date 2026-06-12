import { locales, type Locale } from "@/i18n/config"
import { withEdgeCache } from "@/lib/api/edge-cache"
import { searchSearchEngine } from "@/lib/search/flexsearch"
import { getSearchEngine } from "@/lib/search/server"

import type { Runtime } from "@astrojs/cloudflare"
import type { APIRoute } from "astro"

export const prerender = false

const DEFAULT_LIMIT = 8
const MAX_LIMIT = 50
const CACHE_CONTROL = "public, max-age=300, stale-while-revalidate=3600"

export const GET: APIRoute = async ({ params, url, request, locals }) => {
  const locale = params.locale as Locale
  if (!locales.includes(locale)) {
    return new Response("Not found", { status: 404 })
  }

  const query = url.searchParams.get("q")?.trim() ?? ""
  if (query.length < 2) {
    return Response.json({ results: [] })
  }

  const cfContext = (locals as Partial<Runtime>).cfContext
  const waitUntil = cfContext ? cfContext.waitUntil.bind(cfContext) : undefined

  return withEdgeCache(
    request,
    async () => {
      const rawLimit = Number(url.searchParams.get("limit") ?? DEFAULT_LIMIT)
      const limit = Number.isFinite(rawLimit)
        ? Math.min(Math.max(Math.trunc(rawLimit), 1), MAX_LIMIT)
        : DEFAULT_LIMIT

      const engine = await getSearchEngine(locale)
      const results = await searchSearchEngine(engine, query, { limit })

      return Response.json(
        { results },
        { headers: { "Cache-Control": CACHE_CONTROL } }
      )
    },
    { waitUntil }
  )
}
