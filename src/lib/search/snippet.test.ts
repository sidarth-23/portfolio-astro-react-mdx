import { describe, expect, it } from "vitest"

import { createSnippet, findMatchRanges, normalizeForMatch } from "./snippet"

describe("normalizeForMatch", () => {
  it("strips diacritics and lowercases without shifting offsets", () => {
    const input = "Métricas y Diseño"
    const normalized = normalizeForMatch(input)

    expect(normalized).toBe("metricas y diseno")
    expect(normalized.length).toBe(input.length)
  })

  it("handles ç and accented french text", () => {
    expect(normalizeForMatch("Façade Réessayez")).toBe("facade reessayez")
  })
})

describe("findMatchRanges", () => {
  it("finds prefix matches at word boundaries", () => {
    const ranges = findMatchRanges("Deploy the deployment pipeline", "deploy")

    expect(ranges).toEqual([
      { start: 0, end: 6 },
      { start: 11, end: 17 },
    ])
  })

  it("ignores mid-word occurrences", () => {
    const ranges = findMatchRanges("redeploy something", "deploy")

    expect(ranges).toEqual([])
  })

  it("merges overlapping ranges from multiple tokens", () => {
    const ranges = findMatchRanges("deployment", "deploy deployment")

    expect(ranges).toEqual([{ start: 0, end: 10 }])
  })

  it("matches accented text against unaccented queries", () => {
    const text = "Las métricas importan"
    const ranges = findMatchRanges(text, "metricas")

    expect(ranges).toHaveLength(1)
    expect(text.slice(ranges[0].start, ranges[0].end)).toBe("métricas")
  })

  it("ignores single-character tokens", () => {
    expect(findMatchRanges("a big apple", "a big")).toEqual([
      { start: 2, end: 5 },
    ])
  })
})

describe("createSnippet", () => {
  it("returns short content whole with matches", () => {
    const snippet = createSnippet("We watch metrics during deploys.", "metrics")

    expect(snippet.text).toBe("We watch metrics during deploys.")
    expect(snippet.matches).toEqual([{ start: 9, end: 16 }])
  })

  it("windows long content around the first match with ellipses", () => {
    const padding = "lorem ipsum dolor sit amet ".repeat(10)
    const content = `${padding}deployment target here ${padding}`

    const snippet = createSnippet(content, "deployment")

    expect(snippet.text.startsWith("...")).toBe(true)
    expect(snippet.text.endsWith("...")).toBe(true)
    expect(snippet.text).toContain("deployment")

    const [range] = snippet.matches
    expect(snippet.text.slice(range.start, range.end)).toBe("deployment")
  })

  it("falls back to a head slice when nothing matches", () => {
    const content = "word ".repeat(100)
    const snippet = createSnippet(content, "zzzmissing")

    expect(snippet.text.endsWith("...")).toBe(true)
    expect(snippet.text.length).toBeLessThanOrEqual(180)
    expect(snippet.matches).toEqual([])
  })

  it("returns empty for empty content", () => {
    expect(createSnippet("", "query")).toEqual({ text: "", matches: [] })
  })
})
