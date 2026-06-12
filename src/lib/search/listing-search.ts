import type { Locale } from "@/i18n/config"

import { getSearchEngine } from "./server"

const SEARCH_HIT_LIMIT = 200

/**
 * Resolves a free-text query to blog post slugs in relevance order. Section
 * hits collapse into their parent post at the position of its best-ranked hit.
 */
export async function searchBlogSlugs(
  locale: Locale,
  query: string
): Promise<string[]> {
  const engine = await getSearchEngine(locale)

  // Sync search on purpose — see the note in searchSearchEngine.
  const hits = engine.index.search(query, {
    index: ["title", "sectionTitle", "tagsText", "content"],
    limit: SEARCH_HIT_LIMIT,
    suggest: true,
    merge: true,
    tag: { scope: "blog" },
  })

  const slugs: string[] = []
  const seen = new Set<string>()

  for (const hit of hits) {
    const doc = engine.docs[Number(hit.id)]
    if (!doc || doc.scope !== "blog" || !doc.slug) continue
    if (seen.has(doc.slug)) continue

    seen.add(doc.slug)
    slugs.push(doc.slug)
  }

  return slugs
}
