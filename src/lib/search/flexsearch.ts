import Search, { type Document } from "flexsearch"

import { normalizeWhitespace } from "@/lib/content/text"

import type { SearchDocument, SearchResult } from "./search"

export type SearchIndexExport = Record<string, string>

export type FlexSearchDocument = {
  id: string
  title: string
  sectionTitle: string
  url: string
  content: string
  kind: SearchDocument["kind"]
  weight: number
  tags: string[]
  pageId: string
  [key: string]: string | number | boolean | string[] | null
}

function createDocument() {
  return new Search.Document<FlexSearchDocument>({
    tokenize: "full",
    document: {
      id: "id",
      index: ["content"],
      tag: ["tags"],
      store: true,
    },
  })
}

function createSnippet(content: string, query: string): string {
  const text = normalizeWhitespace(content)
  if (!text) return ""

  if (text.length <= 180) return text

  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase().trim()
  const index = lowerQuery ? lowerText.indexOf(lowerQuery) : -1

  if (index === -1) {
    return `${text.slice(0, 177).trim()}...`
  }

  const start = Math.max(0, index - 60)
  const end = Math.min(text.length, index + 120)
  return `${start > 0 ? "..." : ""}${text.slice(start, end).trim()}${
    end < text.length ? "..." : ""
  }`
}

export function buildSearchIndexExport(
  docs: SearchDocument[]
): SearchIndexExport {
  const index = createDocument()

  for (const doc of docs) {
    index.add(doc.id, {
      ...doc,
      sectionTitle: doc.sectionTitle ?? "",
      pageId: doc.kind === "page" ? doc.id : doc.url.split("#")[0],
    })
  }

  const raw: SearchIndexExport = {}
  index.export((key, data) => {
    raw[key] = data
  })
  return raw
}

export function importSearchIndex(
  raw: SearchIndexExport
): Document<FlexSearchDocument> {
  const index = createDocument()

  for (const [key, data] of Object.entries(raw)) {
    index.import(key, data)
  }

  return index
}

export async function searchFlexSearchIndex(
  index: Document<FlexSearchDocument>,
  query: string,
  limit = 8
): Promise<SearchResult[]> {
  const results = await index.searchAsync(query, {
    index: "content",
    limit,
  })

  if (results.length === 0) return []

  const ids = results[0]?.result ?? []
  const queryKey = normalizeWhitespace(query).toLowerCase()
  const queryTokens = queryKey.split(" ").filter(Boolean)
  const out: Array<SearchResult & { weight: number; score: number }> = []

  const rankDocument = (doc: FlexSearchDocument): number => {
    const label = normalizeWhitespace(
      doc.sectionTitle || doc.title
    ).toLowerCase()
    if (!queryKey || !label) return 0

    if (label === queryKey) return 1000

    return queryTokens.length > 0 &&
      queryTokens.every((token) => label.includes(token))
      ? 500
      : 0
  }

  for (const id of ids) {
    const doc = index.get(id)
    if (!doc) continue

    out.push({
      id: doc.id,
      title: doc.title,
      sectionTitle: doc.sectionTitle,
      url: doc.url,
      snippet: createSnippet(doc.content, query),
      kind: doc.kind,
      weight: doc.weight,
      score: rankDocument(doc),
    })
  }

  return out
    .sort(
      (a, b) =>
        b.score - a.score ||
        Number(a.kind === "page") - Number(b.kind === "page") ||
        b.weight - a.weight
    )
    .map((result) => ({
      id: result.id,
      title: result.title,
      sectionTitle: result.sectionTitle,
      url: result.url,
      snippet: result.snippet,
      kind: result.kind,
    }))
}
