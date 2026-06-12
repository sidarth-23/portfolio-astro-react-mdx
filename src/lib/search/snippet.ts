import { normalizeWhitespace } from "@/lib/content/text"

export interface MatchRange {
  start: number
  end: number
}

export interface Snippet {
  text: string
  matches: MatchRange[]
}

const SNIPPET_MAX_LENGTH = 180
const SNIPPET_HEAD_LENGTH = 177
const SNIPPET_BEFORE = 60
const SNIPPET_AFTER = 120
const MIN_TOKEN_LENGTH = 2

/**
 * Mirrors the flexsearch "Normalize" encoder (NFKD, strip combining marks,
 * lowercase) per character so output offsets stay aligned with the input
 * string and client-side highlights agree with what the index matched.
 */
export function normalizeForMatch(value: string): string {
  let out = ""
  for (const char of value) {
    const normalized = char
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
    out += normalized.length === char.length ? normalized : char.toLowerCase()
  }
  return out
}

function isWordChar(char: string | undefined): boolean {
  return char !== undefined && /[a-z0-9]/.test(char)
}

function tokenizeQuery(query: string): string[] {
  return Array.from(
    new Set(
      normalizeForMatch(query)
        .split(/[^a-z0-9]+/)
        .filter((token) => token.length >= MIN_TOKEN_LENGTH)
    )
  )
}

export function findMatchRanges(text: string, query: string): MatchRange[] {
  const normalizedText = normalizeForMatch(text)
  const tokens = tokenizeQuery(query)
  const ranges: MatchRange[] = []

  for (const token of tokens) {
    let index = normalizedText.indexOf(token)
    while (index !== -1) {
      if (!isWordChar(normalizedText[index - 1])) {
        ranges.push({ start: index, end: index + token.length })
      }
      index = normalizedText.indexOf(token, index + 1)
    }
  }

  ranges.sort((a, b) => a.start - b.start || a.end - b.end)

  const merged: MatchRange[] = []
  for (const range of ranges) {
    const last = merged[merged.length - 1]
    if (last && range.start <= last.end) {
      last.end = Math.max(last.end, range.end)
      continue
    }
    merged.push({ ...range })
  }

  return merged
}

export function createSnippet(content: string, query: string): Snippet {
  const text = normalizeWhitespace(content)
  if (!text) return { text: "", matches: [] }

  if (text.length <= SNIPPET_MAX_LENGTH) {
    return { text, matches: findMatchRanges(text, query) }
  }

  const firstMatch = findMatchRanges(text, query)[0]
  if (!firstMatch) {
    return {
      text: `${text.slice(0, SNIPPET_HEAD_LENGTH).trim()}...`,
      matches: [],
    }
  }

  const start = Math.max(0, firstMatch.start - SNIPPET_BEFORE)
  const end = Math.min(text.length, firstMatch.start + SNIPPET_AFTER)
  const snippetText = `${start > 0 ? "..." : ""}${text.slice(start, end).trim()}${
    end < text.length ? "..." : ""
  }`

  return { text: snippetText, matches: findMatchRanges(snippetText, query) }
}
