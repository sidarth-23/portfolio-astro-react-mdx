import { describe, expect, it, vi, beforeEach } from "vitest"

import { getBlogListing, getBlogFilters } from "./listing-api"
import { resetListingCache } from "./listing-data"

import type { CollectionEntry } from "astro:content"

// Mock astro:content
const mockGetCollection = vi.fn()
vi.mock("astro:content", () => ({
  getCollection: (...args: Parameters<typeof mockGetCollection>) =>
    mockGetCollection(...args),
}))

const mockGetImage = vi.fn()
vi.mock("astro:assets", () => ({
  getImage: (...args: Parameters<typeof mockGetImage>) => mockGetImage(...args),
}))

const mockSearchBlogSlugs = vi.fn()
vi.mock("@/lib/search/listing-search", () => ({
  searchBlogSlugs: (...args: Parameters<typeof mockSearchBlogSlugs>) =>
    mockSearchBlogSlugs(...args),
}))

// Helper to create mock blog entries
function createMockBlogEntries(count: number): CollectionEntry<"blog">[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `en/post-${i + 1}`,
    collection: "blog" as const,
    data: {
      title: `Post ${i + 1}`,
      description: `Description for post ${i + 1}`,
      date: new Date(2024, 0, count - i),
      draft: false,
      coverImage: {
        src: `../../../assets/images/blog/post-${i + 1}/cover.jpg`,
        width: 800,
        height: 600,
        format: "jpg" as const,
      },
      tags: i % 2 === 0 ? ["astro", "tutorial"] : ["react", "advanced"],
      category: i % 3 === 0 ? "Backend" : "Frontend",
      locale: "en" as const,
    },
    body: "",
    rendered: undefined,
    filePath: `src/content/blog/en/post-${i + 1}.mdx`,
  })) as CollectionEntry<"blog">[]
}

const ENTRY_COUNT = 24

describe("listing-api", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetListingCache()
    mockGetImage.mockImplementation(async (input: { width: number }) => ({
      src: `/_optimized/test-${input.width}.webp`,
      attributes: {
        width: input.width,
        height: Math.round(input.width * 0.5667),
      },
    }))
    mockGetCollection.mockImplementation(
      async (
        _collection: string,
        filter?: (entry: CollectionEntry<"blog">) => boolean
      ) => {
        const entries = createMockBlogEntries(ENTRY_COUNT)
        if (filter) {
          return entries.filter(filter)
        }
        return entries
      }
    )
    mockSearchBlogSlugs.mockResolvedValue([])
  })

  describe("getBlogListing", () => {
    it("returns paginated results with default limit", async () => {
      const result = await getBlogListing("en")
      expect(result.items).toHaveLength(Math.min(12, result.total))
      expect(result.page).toBe(1)
      expect(typeof result.hasMore).toBe("boolean")
      expect(typeof result.total).toBe("number")
    })

    it("resolves search terms through the search engine in relevance order", async () => {
      mockSearchBlogSlugs.mockResolvedValue(["post-3", "post-1", "post-7"])

      const result = await getBlogListing("en", { search: "astro" })

      expect(mockSearchBlogSlugs).toHaveBeenCalledWith("en", "astro")
      expect(result.items.map((item) => item.slug)).toEqual([
        "post-3",
        "post-1",
        "post-7",
      ])
      expect(result.total).toBe(3)
    })

    it("ignores searches shorter than two characters", async () => {
      const result = await getBlogListing("en", { search: "a" })

      expect(mockSearchBlogSlugs).not.toHaveBeenCalled()
      expect(result.total).toBe(ENTRY_COUNT)
    })

    it("drops search hits for slugs not in the listing", async () => {
      mockSearchBlogSlugs.mockResolvedValue(["post-2", "nonexistent-slug"])

      const result = await getBlogListing("en", { search: "react" })

      expect(result.items.map((item) => item.slug)).toEqual(["post-2"])
    })

    it("applies explicit sort over search relevance order", async () => {
      mockSearchBlogSlugs.mockResolvedValue(["post-3", "post-1", "post-2"])

      const result = await getBlogListing("en", {
        search: "astro",
        sort: "title-asc",
      })

      expect(result.items.map((item) => item.slug)).toEqual([
        "post-1",
        "post-2",
        "post-3",
      ])
    })

    it("combines search with tag filters", async () => {
      // post-1 (index 0) has astro/tutorial tags; post-2 (index 1) has react/advanced
      mockSearchBlogSlugs.mockResolvedValue(["post-1", "post-2"])

      const result = await getBlogListing("en", {
        search: "post",
        tags: ["react"],
      })

      expect(result.items.map((item) => item.slug)).toEqual(["post-2"])
    })

    it("filters by tags", async () => {
      const result = await getBlogListing("en", { tags: ["react"] })
      expect(result.items.every((item) => item.tags.includes("react"))).toBe(
        true
      )
    })

    it("filters by categories", async () => {
      const result = await getBlogListing("en", { categories: ["Backend"] })
      expect(result.items.every((item) => item.category === "Backend")).toBe(
        true
      )
    })

    it("filters by date range inclusively", async () => {
      const from = "2024-01-05"
      const to = "2024-01-10"
      const result = await getBlogListing("en", { from, to, limit: 24 })

      const fromTime = Date.parse(`${from}T00:00:00.000Z`)
      const toTime = Date.parse(`${to}T23:59:59.999Z`)
      expect(result.total).toBeGreaterThan(0)
      expect(result.total).toBeLessThan(ENTRY_COUNT)
      expect(
        result.items.every((item) => {
          const time = Date.parse(item.date)
          return time >= fromTime && time <= toTime
        })
      ).toBe(true)
    })

    it("supports open-ended date ranges", async () => {
      const fromOnly = await getBlogListing("en", {
        from: "2024-01-10",
        limit: 24,
      })
      const fromTime = Date.parse("2024-01-10T00:00:00.000Z")
      expect(fromOnly.total).toBeGreaterThan(0)
      expect(
        fromOnly.items.every((item) => Date.parse(item.date) >= fromTime)
      ).toBe(true)

      const toOnly = await getBlogListing("en", { to: "2024-01-10", limit: 24 })
      const toTime = Date.parse("2024-01-10T23:59:59.999Z")
      expect(toOnly.total).toBeGreaterThan(0)
      expect(
        toOnly.items.every((item) => Date.parse(item.date) <= toTime)
      ).toBe(true)
      expect(fromOnly.total + toOnly.total).toBeGreaterThanOrEqual(ENTRY_COUNT)
    })

    it("combines search with date range filters", async () => {
      mockSearchBlogSlugs.mockResolvedValue(["post-1", "post-24"])

      const result = await getBlogListing("en", {
        search: "post",
        from: "2024-01-02",
      })

      // post-24 has the oldest date (Jan 1) and falls outside the range.
      expect(result.items.map((item) => item.slug)).toEqual(["post-1"])
    })

    it("sorts by date descending", async () => {
      const result = await getBlogListing("en", { sort: "date-desc" })
      for (let i = 1; i < result.items.length; i++) {
        expect(
          new Date(result.items[i - 1].date).getTime()
        ).toBeGreaterThanOrEqual(new Date(result.items[i].date).getTime())
      }
    })

    it("defaults to date descending without explicit sort", async () => {
      const result = await getBlogListing("en")
      for (let i = 1; i < result.items.length; i++) {
        expect(
          new Date(result.items[i - 1].date).getTime()
        ).toBeGreaterThanOrEqual(new Date(result.items[i].date).getTime())
      }
    })

    it("sorts by date ascending", async () => {
      const result = await getBlogListing("en", { sort: "date-asc" })
      for (let i = 1; i < result.items.length; i++) {
        expect(
          new Date(result.items[i - 1].date).getTime()
        ).toBeLessThanOrEqual(new Date(result.items[i].date).getTime())
      }
    })

    it("sorts by title ascending", async () => {
      const result = await getBlogListing("en", { sort: "title-asc" })
      for (let i = 1; i < result.items.length; i++) {
        expect(
          result.items[i - 1].title.localeCompare(result.items[i].title)
        ).toBeLessThanOrEqual(0)
      }
    })

    it("sorts by title descending", async () => {
      const result = await getBlogListing("en", { sort: "title-desc" })
      for (let i = 1; i < result.items.length; i++) {
        expect(
          result.items[i - 1].title.localeCompare(result.items[i].title)
        ).toBeGreaterThanOrEqual(0)
      }
    })

    it("returns second page", async () => {
      const result = await getBlogListing("en", { page: 2, limit: 5 })
      expect(result.page).toBe(2)
      expect(result.items).toHaveLength(
        Math.min(5, Math.max(0, result.total - 5))
      )
    })

    it("includes optimized image data", async () => {
      const result = await getBlogListing("en", { limit: 1 })
      expect(result.items[0]).toHaveProperty("coverImage")
      expect(result.items[0].coverImage).toHaveProperty("src")
      expect(result.items[0].coverImage).toHaveProperty("srcSet")
      expect(result.items[0].coverImage).toHaveProperty("sizes")
      const widths = mockGetImage.mock.calls
        .slice(0, 3)
        .map((call) => (call[0] as { width: number }).width)
      expect(widths).toEqual([400, 600, 1200])
    })

    it("memoizes listing data across calls", async () => {
      await getBlogListing("en")
      const collectionCalls = mockGetCollection.mock.calls.length
      const imageCalls = mockGetImage.mock.calls.length
      expect(imageCalls).toBe(ENTRY_COUNT * 3)

      await getBlogListing("en", { page: 2 })
      await getBlogFilters("en")

      expect(mockGetCollection.mock.calls.length).toBe(collectionCalls)
      expect(mockGetImage.mock.calls.length).toBe(imageCalls)
    })
  })

  describe("getBlogFilters", () => {
    it("returns unique sorted tags", async () => {
      const result = await getBlogFilters("en")
      expect(Array.isArray(result.tags)).toBe(true)
      expect(result.tags.length).toBeGreaterThan(0)
      expect(result.tags).toEqual([...result.tags].sort())
      expect(new Set(result.tags).size).toBe(result.tags.length)
    })

    it("returns unique sorted categories", async () => {
      const result = await getBlogFilters("en")
      expect(Array.isArray(result.categories)).toBe(true)
      expect(result.categories.length).toBeGreaterThan(0)
      expect(result.categories).toEqual([...result.categories].sort())
      expect(new Set(result.categories).size).toBe(result.categories.length)
    })
  })
})
