import type { APIRoute } from "astro"
import { getProjectListing, getProjectFilters } from "@/lib/api/listing-api"
import type { Locale } from "@/i18n/config"

export const prerender = false

export const GET: APIRoute = async ({ url, params }) => {
  const locale = (params.locale as Locale) || "en"

  const search = url.searchParams.get("search") || undefined
  const tagsParam = url.searchParams.get("tags")
  const categoriesParam = url.searchParams.get("categories")
  const sort = url.searchParams.get("sort") as
    | "newest"
    | "oldest"
    | "title"
    | undefined
  const page = parseInt(url.searchParams.get("page") || "1", 10)
  const limit = parseInt(url.searchParams.get("limit") || "12", 10)

  const tags = tagsParam ? tagsParam.split(",") : undefined
  const categories = categoriesParam ? categoriesParam.split(",") : undefined

  try {
    const [listing, filters] = await Promise.all([
      getProjectListing(locale, {
        search,
        tags,
        categories,
        sort,
        page,
        limit,
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
