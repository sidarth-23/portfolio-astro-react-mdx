import type { APIRoute } from "astro"
import { fetchProjectPage } from "@/lib/fetchers"
import type { Locale } from "@/i18n/config"
import { locales } from "@/i18n/config"

export const prerender = false

export const GET: APIRoute = async ({ url }) => {
  const locale = (url.searchParams.get("locale") ?? "en") as Locale
  const tag = url.searchParams.get("tag")
  const search = url.searchParams.get("search")
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10))
  const limit = Math.max(1, parseInt(url.searchParams.get("limit") ?? "12", 10))

  if (!locales.includes(locale)) {
    return new Response(JSON.stringify({ error: "Invalid locale" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  try {
    const result = await fetchProjectPage(locale, tag, search, page, limit)

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error fetching projects:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch projects" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
