import { describe, expect, it } from "vitest"

import {
  parseListingFilters,
  parseListingRequest,
  serializeListingFilters,
  serializeListingRequest,
  mergeListingFilters,
  toListingFilters,
} from "./listing-query"

describe("listing-query codec", () => {
  describe("parseListingFilters", () => {
    it("returns defaults for empty params", () => {
      const result = parseListingFilters(new URLSearchParams())
      expect(result).toEqual({
        search: "",
        tags: [],
        categories: [],
        sort: null,
      })
    })

    it("parses full filter set", () => {
      const params = new URLSearchParams({
        search: "astro",
        tags: "react,typescript",
        categories: "Frontend",
        sort: "newest",
      })
      const result = parseListingFilters(params)
      expect(result).toEqual({
        search: "astro",
        tags: ["react", "typescript"],
        categories: ["Frontend"],
        sort: "newest",
      })
    })

    it("ignores invalid sort values", () => {
      const params = new URLSearchParams({ sort: "invalid" })
      const result = parseListingFilters(params)
      expect(result.sort).toBeNull()
    })

    it("trims empty strings from comma-separated arrays", () => {
      const params = new URLSearchParams({ tags: "a,,b," })
      const result = parseListingFilters(params)
      expect(result.tags).toEqual(["a", "b"])
    })
  })

  describe("parseListingRequest", () => {
    it("uses defaults for missing page and limit", () => {
      const result = parseListingRequest(new URLSearchParams())
      expect(result.page).toBe(1)
      expect(result.limit).toBe(12)
    })

    it("uses custom defaults when provided", () => {
      const result = parseListingRequest(new URLSearchParams(), {
        page: 2,
        limit: 24,
      })
      expect(result.page).toBe(2)
      expect(result.limit).toBe(24)
    })

    it("falls back to defaults on invalid page/limit", () => {
      const params = new URLSearchParams({ page: "abc", limit: "-1" })
      const result = parseListingRequest(params)
      expect(result.page).toBe(1)
      expect(result.limit).toBe(12)
    })

    it("falls back to defaults on zero page/limit", () => {
      const params = new URLSearchParams({ page: "0", limit: "0" })
      const result = parseListingRequest(params)
      expect(result.page).toBe(1)
      expect(result.limit).toBe(12)
    })

    it("parses valid page and limit", () => {
      const params = new URLSearchParams({ page: "3", limit: "6" })
      const result = parseListingRequest(params)
      expect(result.page).toBe(3)
      expect(result.limit).toBe(6)
    })
  })

  describe("serializeListingFilters", () => {
    it("returns empty string for default filters", () => {
      const result = serializeListingFilters({
        search: "",
        tags: [],
        categories: [],
        sort: null,
      })
      expect(result).toBe("")
    })

    it("serializes filter keys in stable order", () => {
      const result = serializeListingFilters({
        search: "astro",
        tags: ["react"],
        categories: ["Frontend"],
        sort: "title",
      })
      expect(result).toBe(
        "search=astro&tags=react&categories=Frontend&sort=title"
      )
    })
  })

  describe("serializeListingRequest", () => {
    it("serializes page and limit before filters", () => {
      const result = serializeListingRequest({
        search: "astro",
        tags: ["react"],
        categories: [],
        sort: null,
        page: 2,
        limit: 6,
      })
      expect(result).toBe("page=2&limit=6&search=astro&tags=react")
    })
  })

  describe("mergeListingFilters", () => {
    it("returns empty string when no params remain", () => {
      const result = mergeListingFilters("", {
        search: "",
        tags: [],
        categories: [],
        sort: null,
      })
      expect(result).toBe("")
    })

    it("returns leading ? when params exist", () => {
      const result = mergeListingFilters("", {
        search: "astro",
        tags: [],
        categories: [],
        sort: null,
      })
      expect(result).toBe("?search=astro")
    })

    it("preserves unrelated params", () => {
      const result = mergeListingFilters("?utm_source=email", {
        search: "astro",
        tags: [],
        categories: [],
        sort: null,
      })
      expect(result).toBe("?utm_source=email&search=astro")
    })

    it("replaces existing listing params", () => {
      const result = mergeListingFilters("?search=old&tags=a", {
        search: "new",
        tags: ["b"],
        categories: [],
        sort: null,
      })
      expect(result).toBe("?search=new&tags=b")
    })

    it("removes cleared listing params while preserving unrelated ones", () => {
      const result = mergeListingFilters("?search=old&utm_source=email", {
        search: "",
        tags: [],
        categories: [],
        sort: null,
      })
      expect(result).toBe("?utm_source=email")
    })
  })

  describe("toListingFilters", () => {
    it("omits empty/default fields", () => {
      const result = toListingFilters({
        search: "",
        tags: [],
        categories: [],
        sort: null,
      })
      expect(result).toEqual({})
    })

    it("includes only populated fields", () => {
      const result = toListingFilters({
        search: "astro",
        tags: ["react"],
        categories: ["Frontend"],
        sort: "newest",
      })
      expect(result).toEqual({
        search: "astro",
        tags: ["react"],
        categories: ["Frontend"],
        sort: "newest",
      })
    })
  })
})
