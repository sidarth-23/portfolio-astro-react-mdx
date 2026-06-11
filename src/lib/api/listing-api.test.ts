import { describe, expect, it, vi, beforeEach } from "vitest"

import { getBlogListing, getBlogFilters } from "./listing-api"

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

describe("listing-api", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetImage.mockImplementation(async (input: { width: number }) => ({
      src: `/_optimized/test-${input.width}.webp`,
      attributes: {
        width: input.width,
        height: Math.round(input.width * 0.5667),
      },
    }))
  })

  describe("getBlogListing", () => {
    beforeEach(() => {
      mockGetCollection.mockImplementation(
        async (
          _collection: string,
          filter?: (entry: CollectionEntry<"blog">) => boolean
        ) => {
          const entries = createMockBlogEntries(24)
          if (filter) {
            return entries.filter(filter)
          }
          return entries
        }
      )
    })

    it("returns paginated results with default limit", async () => {
      const result = await getBlogListing("en")
      expect(result.items).toHaveLength(Math.min(12, result.total))
      expect(result.page).toBe(1)
      expect(typeof result.hasMore).toBe("boolean")
      expect(typeof result.total).toBe("number")
    })

    it("filters by search term in title, description, or tags", async () => {
      const result = await getBlogListing("en", { search: "astro" })
      expect(
        result.items.every(
          (item) =>
            item.title.toLowerCase().includes("astro") ||
            item.description.toLowerCase().includes("astro") ||
            item.tags.some((tag) => tag.toLowerCase().includes("astro"))
        )
      ).toBe(true)
    })

    it("filters by search term matching tags", async () => {
      const result = await getBlogListing("en", { search: "react" })
      expect(
        result.items.every(
          (item) =>
            item.title.toLowerCase().includes("react") ||
            item.description.toLowerCase().includes("react") ||
            item.tags.some((tag) => tag.toLowerCase().includes("react"))
        )
      ).toBe(true)
      expect(result.items.length).toBeGreaterThan(0)
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

    it("sorts by newest", async () => {
      const result = await getBlogListing("en", { sort: "newest" })
      for (let i = 1; i < result.items.length; i++) {
        expect(
          new Date(result.items[i - 1].date).getTime()
        ).toBeGreaterThanOrEqual(new Date(result.items[i].date).getTime())
      }
    })

    it("sorts by oldest", async () => {
      const result = await getBlogListing("en", { sort: "oldest" })
      for (let i = 1; i < result.items.length; i++) {
        expect(
          new Date(result.items[i - 1].date).getTime()
        ).toBeLessThanOrEqual(new Date(result.items[i].date).getTime())
      }
    })

    it("sorts by title", async () => {
      const result = await getBlogListing("en", { sort: "title" })
      for (let i = 1; i < result.items.length; i++) {
        expect(
          result.items[i - 1].title.localeCompare(result.items[i].title)
        ).toBeLessThanOrEqual(0)
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
      mockGetImage.mockClear()
      const result = await getBlogListing("en", { limit: 1 })
      expect(result.items[0]).toHaveProperty("coverImage")
      expect(result.items[0].coverImage).toHaveProperty("src")
      expect(result.items[0].coverImage).toHaveProperty("srcSet")
      expect(result.items[0].coverImage).toHaveProperty("sizes")
      expect(mockGetImage).toHaveBeenCalledTimes(3)
      const widths = mockGetImage.mock.calls.map(
        (call) => (call[0] as { width: number }).width
      )
      expect(widths).toEqual([400, 600, 1200])
    })
  })

  describe("getBlogFilters", () => {
    beforeEach(() => {
      mockGetCollection.mockImplementation(
        async (
          _collection: string,
          filter?: (entry: CollectionEntry<"blog">) => boolean
        ) => {
          const entries = createMockBlogEntries(24)
          if (filter) {
            return entries.filter(filter)
          }
          return entries
        }
      )
    })

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
