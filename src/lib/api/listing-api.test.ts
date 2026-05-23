import { describe, expect, it, vi, beforeEach } from "vitest"

// Mock the image manifest to avoid file system operations
vi.mock("@/lib/api/image-manifest", () => ({
  getOptimizedImageSet: vi.fn().mockResolvedValue({
    "400": "/_optimized/test-400.webp",
    "600": "/_optimized/test-600.webp",
    "1200": "/_optimized/test-1200.webp",
  }),
  generateSrcSet: vi.fn().mockReturnValue("/_optimized/test-400.webp 400w, /_optimized/test-600.webp 600w, /_optimized/test-1200.webp 1200w"),
  generateSizes: vi.fn().mockReturnValue("(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"),
}))

// Mock astro:content
const mockGetCollection = vi.fn()
vi.mock("astro:content", () => ({
  getCollection: (...args: unknown[]) => mockGetCollection(...args),
}))

import { getBlogListing, getProjectListing, getBlogFilters, getProjectFilters } from "./listing-api"
import type { CollectionEntry } from "astro:content"

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

// Helper to create mock project entries
function createMockProjectEntries(count: number): CollectionEntry<"projects">[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `en/project-${i + 1}`,
    collection: "projects" as const,
    data: {
      title: `Project ${i + 1}`,
      summary: `Summary for project ${i + 1}`,
      date: new Date(2024, 0, count - i),
      coverImage: {
        src: `../../../assets/images/projects/project-${i + 1}/cover.png`,
        width: 800,
        height: 600,
        format: "png" as const,
      },
      featured: i < 3,
      status: "active" as const,
      tags: i % 2 === 0 ? ["react", "typescript"] : ["vue", "nuxt"],
      category: i % 2 === 0 ? "Web App" : "Mobile",
      locale: "en" as const,
    },
    body: "",
    rendered: undefined,
    filePath: `src/content/projects/en/project-${i + 1}.mdx`,
  })) as CollectionEntry<"projects">[]
}

describe("listing-api", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("getBlogListing", () => {
    beforeEach(() => {
      mockGetCollection.mockImplementation(async (_collection: string, filter?: (entry: CollectionEntry<'blog'>) => boolean) => {
        const entries = createMockBlogEntries(24)
        if (filter) {
          return entries.filter(filter)
        }
        return entries
      })
    })

    it("returns paginated results with default limit", async () => {
      const result = await getBlogListing("en")
      expect(result.items).toHaveLength(Math.min(12, result.total))
      expect(result.page).toBe(1)
      expect(typeof result.hasMore).toBe("boolean")
      expect(typeof result.total).toBe("number")
    })

    it("filters by search term", async () => {
      const result = await getBlogListing("en", { search: "astro" })
      expect(result.items.every(item => 
        item.title.toLowerCase().includes("astro") || 
        item.description.toLowerCase().includes("astro")
      )).toBe(true)
    })

    it("filters by tags", async () => {
      const result = await getBlogListing("en", { tags: ["react"] })
      expect(result.items.every(item => item.tags.includes("react"))).toBe(true)
    })

    it("filters by categories", async () => {
      const result = await getBlogListing("en", { categories: ["Backend"] })
      expect(result.items.every(item => item.category === "Backend")).toBe(true)
    })

    it("sorts by newest", async () => {
      const result = await getBlogListing("en", { sort: "newest" })
      for (let i = 1; i < result.items.length; i++) {
        expect(new Date(result.items[i - 1].date).getTime()).toBeGreaterThanOrEqual(
          new Date(result.items[i].date).getTime()
        )
      }
    })

    it("sorts by oldest", async () => {
      const result = await getBlogListing("en", { sort: "oldest" })
      for (let i = 1; i < result.items.length; i++) {
        expect(new Date(result.items[i - 1].date).getTime()).toBeLessThanOrEqual(
          new Date(result.items[i].date).getTime()
        )
      }
    })

    it("sorts by title", async () => {
      const result = await getBlogListing("en", { sort: "title" })
      for (let i = 1; i < result.items.length; i++) {
        expect(result.items[i - 1].title.localeCompare(result.items[i].title)).toBeLessThanOrEqual(0)
      }
    })

    it("returns second page", async () => {
      const result = await getBlogListing("en", { page: 2, limit: 5 })
      expect(result.page).toBe(2)
      expect(result.items).toHaveLength(Math.min(5, Math.max(0, result.total - 5)))
    })

    it("includes optimized image data", async () => {
      const result = await getBlogListing("en", { limit: 1 })
      expect(result.items[0]).toHaveProperty("coverImage")
      expect(result.items[0].coverImage).toHaveProperty("src")
      expect(result.items[0].coverImage).toHaveProperty("srcSet")
      expect(result.items[0].coverImage).toHaveProperty("sizes")
    })
  })

  describe("getProjectListing", () => {
    beforeEach(() => {
      mockGetCollection.mockImplementation(async (_collection: string, filter?: (entry: CollectionEntry<'projects'>) => boolean) => {
        const entries = createMockProjectEntries(24)
        if (filter) {
          return entries.filter(filter)
        }
        return entries
      })
    })

    it("returns paginated results with default limit", async () => {
      const result = await getProjectListing("en")
      expect(result.items).toHaveLength(Math.min(12, result.total))
      expect(result.page).toBe(1)
    })

    it("filters by status-related terms in search", async () => {
      const result = await getProjectListing("en", { search: "active" })
      // Should either match title/summary or return empty if no matches
      expect(result.items.every(item => 
        item.title.toLowerCase().includes("active") || 
        item.summary.toLowerCase().includes("active")
      ) || result.items.length === 0).toBe(true)
    })

    it("filters by multiple tags", async () => {
      const result = await getProjectListing("en", { tags: ["react", "vue"] })
      expect(result.items.every(item => 
        item.tags.includes("react") || item.tags.includes("vue")
      )).toBe(true)
    })

    it("filters by categories", async () => {
      const result = await getProjectListing("en", { categories: ["Web App"] })
      expect(result.items.every(item => item.category === "Web App")).toBe(true)
    })
  })

  describe("getBlogFilters", () => {
    beforeEach(() => {
      mockGetCollection.mockImplementation(async (_collection: string, filter?: (entry: CollectionEntry<'blog'>) => boolean) => {
        const entries = createMockBlogEntries(24)
        if (filter) {
          return entries.filter(filter)
        }
        return entries
      })
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

  describe("getProjectFilters", () => {
    beforeEach(() => {
      mockGetCollection.mockImplementation(async (_collection: string, filter?: (entry: CollectionEntry<'projects'>) => boolean) => {
        const entries = createMockProjectEntries(24)
        if (filter) {
          return entries.filter(filter)
        }
        return entries
      })
    })

    it("returns unique sorted tags", async () => {
      const result = await getProjectFilters("en")
      expect(Array.isArray(result.tags)).toBe(true)
      expect(result.tags.length).toBeGreaterThan(0)
      expect(result.tags).toEqual([...result.tags].sort())
      expect(new Set(result.tags).size).toBe(result.tags.length)
    })

    it("returns unique sorted categories", async () => {
      const result = await getProjectFilters("en")
      expect(Array.isArray(result.categories)).toBe(true)
      expect(result.categories.length).toBeGreaterThan(0)
      expect(result.categories).toEqual([...result.categories].sort())
      expect(new Set(result.categories).size).toBe(result.categories.length)
    })
  })
})