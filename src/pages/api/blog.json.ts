import type { APIRoute } from "astro"
import { fetchBlogPage } from "@/lib/api"
import type { Locale } from "@/i18n/config"
import { locales } from "@/i18n/config"

export const prerender = false

export const GET: APIRoute = async ({ url }) => {
  const locale = (url.searchParams.get("locale") ?? "en") as Locale
  const tagsParam = url.searchParams.get("tags")
  const categoriesParam = url.searchParams.get("categories")
  const search = url.searchParams.get("search")
  const sort = url.searchParams.get("sort")
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10))
  const limit = Math.max(1, parseInt(url.searchParams.get("limit") ?? "12", 10))

  if (!locales.includes(locale)) {
    return new Response(JSON.stringify({ error: "Invalid locale" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  const tags = tagsParam ? tagsParam.split(",") : null
  const categories = categoriesParam ? categoriesParam.split(",") : null
  const sortMode = sort && ["newest", "oldest", "title"].includes(sort) ? sort as "newest" | "oldest" | "title" : null

  try {
    const result = await fetchBlogPage(locale, tags, categories, search, sortMode, page, limit)

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch blog posts" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
