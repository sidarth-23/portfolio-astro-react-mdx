import type { z } from "zod"
import type { seoSchema } from "@/lib/schemas"

export type SeoData = z.infer<typeof seoSchema>

export function resolveSeo(
  defaults: { title: string; description: string; image?: string },
  pageSeo?: SeoData
) {
  const title = pageSeo?.title ?? defaults.title
  const description = pageSeo?.description ?? defaults.description
  const image = pageSeo?.image ?? defaults.image

  return {
    title,
    description,
    image,
    ogTitle: title,
    ogDescription: description,
    ogImage: image,
    twitterCard: "summary_large_image",
  }
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - 3).trimEnd() + "..."
}
