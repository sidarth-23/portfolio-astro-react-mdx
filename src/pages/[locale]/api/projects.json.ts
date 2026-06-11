import type { Locale } from "@/i18n/config"
import { getProjectListing, getProjectFilters } from "@/lib/api/listing-api"
import { parseListingRequest, toListingFilters } from "@/lib/api/listing-query"

import type { APIRoute } from "astro"

export const prerender = false

export const GET: APIRoute = async ({ url, params }) => {
  const locale = (params.locale as Locale) || "en"
  const query = parseListingRequest(url.searchParams)

  try {
    const [listing, filters] = await Promise.all([
      getProjectListing(locale, {
        ...toListingFilters(query),
        page: query.page,
        limit: query.limit,
      }),
      getProjectFilters(locale),
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
          "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
        },
      }
    )
  } catch (error) {
    console.error("Projects API error:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch projects" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
