import type { Locale } from "@/i18n/config"
import { withEdgeCache } from "@/lib/api/edge-cache"
import { getBlogListing, getBlogFilters } from "@/lib/api/listing-api"
import { parseListingRequest, toListingFilters } from "@/lib/api/listing-query"

import type { Runtime } from "@astrojs/cloudflare"
import type { APIRoute } from "astro"

export const prerender = false

const CACHE_CONTROL = "public, max-age=60, stale-while-revalidate=300"

export const GET: APIRoute = async ({ url, params, request, locals }) => {
  const locale = (params.locale as Locale) || "en"

  const cfContext = (locals as Partial<Runtime>).cfContext
  const waitUntil = cfContext ? cfContext.waitUntil.bind(cfContext) : undefined

  return withEdgeCache(
    request,
    async () => {
      const query = parseListingRequest(url.searchParams)

      try {
        const [listing, filters] = await Promise.all([
          getBlogListing(locale, {
            ...toListingFilters(query),
            page: query.page,
            limit: query.limit,
          }),
          getBlogFilters(locale),
        ])

        return new Response(
          JSON.stringify({
            ...listing,
            availableTags: filters.tags,
            availableCategories: filters.categories,
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": CACHE_CONTROL,
            },
          }
        )
      } catch (error) {
        console.error("Blog API error:", error)
        return new Response(
          JSON.stringify({ error: "Failed to fetch blog posts" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        )
      }
    },
    { waitUntil }
  )
}
