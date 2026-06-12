import Search from "flexsearch"

import { createSnippet, findMatchRanges, normalizeForMatch } from "./snippet"

import type { SearchDocument, SearchResult, SearchScope } from "./search"
import type { Document } from "flexsearch"

export type SearchIndexExport = Record<string, string>

export interface StoredSearchDocument {
  id: string
  title: string
  sectionTitle: string
  url: string
  kind: SearchDocument["kind"]
  weight: number
  scope: SearchScope
  slug: string | null
  content: string
}

// Documents are indexed under their array position — numeric ids keep the
// serialized posting lists small (long string ids would be repeated for
// every prefix key they appear under).
export type SearchDocStore = StoredSearchDocument[]

export interface SearchExportPayload {
  index: SearchIndexExport
  docs: SearchDocStore
}

export interface SearchEngine {
  index: Document<IndexedSearchDocument>
  docs: SearchDocStore
}

export type IndexedSearchDocument = {
  id: number
  title: string
  sectionTitle: string
  tagsText: string
  content: string
  scope: SearchScope
  [key: string]: string | number
}

const FIELD_BOOSTS: Record<string, number> = {
  title: 40,
  sectionTitle: 30,
  tagsText: 20,
  content: 10,
}

// Export and import sides must share the exact same options, otherwise
// flexsearch silently misreads the serialized registers.
export function createDocument() {
  return new Search.Document<IndexedSearchDocument>({
    encoder: "Normalize",
    document: {
      id: "id",
      index: [
        { field: "title", tokenize: "forward", resolution: 9 },
        { field: "sectionTitle", tokenize: "forward", resolution: 9 },
        { field: "tagsText", tokenize: "forward", resolution: 9 },
        { field: "content", tokenize: "forward", resolution: 5 },
      ],
      tag: ["scope"],
      store: false,
    },
  })
}

export function buildSearchIndexExport(
  docs: SearchDocument[]
): SearchExportPayload {
  const index = createDocument()
  const store: SearchDocStore = []

  for (const [numericId, doc] of docs.entries()) {
    index.add(numericId, {
      id: numericId,
      title: doc.title,
      sectionTitle: doc.sectionTitle ?? "",
      tagsText: doc.tags.join(" "),
      content: doc.content,
      scope: doc.scope,
    })

    store.push({
      id: doc.id,
      title: doc.title,
      sectionTitle: doc.sectionTitle ?? "",
      url: doc.url,
      kind: doc.kind,
      weight: doc.weight,
      scope: doc.scope,
      slug: doc.slug,
      content: doc.content,
    })
  }

  const raw: SearchIndexExport = {}
  index.export((key, data) => {
    if (data !== undefined) raw[key] = data
  })

  return { index: raw, docs: store }
}

export function importSearchEngine(payload: SearchExportPayload): SearchEngine {
  const index = createDocument()

  for (const [key, data] of Object.entries(payload.index)) {
    index.import(key, data)
  }

  return { index, docs: payload.docs }
}

interface RankedHit {
  doc: StoredSearchDocument
  score: number
}

function labelBonus(doc: StoredSearchDocument, query: string): number {
  const label = normalizeForMatch(doc.sectionTitle || doc.title).trim()
  const normalizedQuery = normalizeForMatch(query).trim()
  if (!label || !normalizedQuery) return 0

  if (label === normalizedQuery) return 100

  const tokens = normalizedQuery.split(/\s+/).filter(Boolean)
  if (tokens.length > 0 && tokens.every((token) => label.includes(token))) {
    return 50
  }

  return 0
}

export interface SearchQueryOptions {
  limit?: number
  scope?: SearchScope
}

export async function searchSearchEngine(
  engine: SearchEngine,
  query: string,
  options: SearchQueryOptions = {}
): Promise<SearchResult[]> {
  const limit = options.limit ?? 8

  // Synchronous search on purpose: flexsearch's async variant schedules work
  // through timers that stall under workerd, and the corpus is small enough
  // that sync search stays well under a millisecond.
  const hits = engine.index.search(query, {
    index: ["title", "sectionTitle", "tagsText", "content"],
    limit: limit * 4,
    suggest: true,
    merge: true,
    ...(options.scope ? { tag: { scope: options.scope } } : {}),
  })

  const ranked: RankedHit[] = []

  for (const [position, hit] of hits.entries()) {
    const doc = engine.docs[Number(hit.id)]
    if (!doc) continue
    if (options.scope && doc.scope !== options.scope) continue

    const fields = hit.field ?? []
    const fieldScore = fields.reduce(
      (sum, field) => sum + (FIELD_BOOSTS[field] ?? 0),
      0
    )

    ranked.push({
      doc,
      // weight breaks field-score ties; position preserves flexsearch's
      // relevance order between otherwise equal hits
      score:
        fieldScore +
        labelBonus(doc, query) +
        doc.weight / 1000 -
        position / 1e6,
    })
  }

  ranked.sort((a, b) => b.score - a.score)

  return ranked.slice(0, limit).map(({ doc }) => {
    const snippet = createSnippet(doc.content, query)

    return {
      id: doc.id,
      title: doc.title,
      sectionTitle: doc.sectionTitle || undefined,
      url: doc.url,
      kind: doc.kind,
      scope: doc.scope,
      snippet: snippet.text,
      snippetMatches: snippet.matches,
      titleMatches: findMatchRanges(doc.title, query),
      sectionTitleMatches: findMatchRanges(doc.sectionTitle, query),
    }
  })
}
