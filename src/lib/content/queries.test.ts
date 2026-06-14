import { describe, expect, it, vi, beforeEach } from "vitest"

import { getFeaturedBlogPosts } from "./queries"

import type { CollectionEntry } from "astro:content"

// Mock astro:content
const mockGetCollection = vi.fn()
vi.mock("astro:content", () => ({
  getCollection: (...args: Parameters<typeof mockGetCollection>) =>
    mockGetCollection(...args),
}))

function createMockBlogEntries(
  locale: string,
  count: number,
  featured: boolean
): CollectionEntry<"blog">[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${locale}/post-${featured ? "featured" : "regular"}-${i + 1}`,
    collection: "blog" as const,
    data: {
      title: `Post ${i + 1}`,
      description: `Description ${i + 1}`,
      date: new Date(2024, 0, count - i),
      draft: false,
      featured,
      links: [],
      tags: [],
      locale: locale as "en" | "es" | "fr",
      coverImage: {
        src: `/images/post-${i + 1}.png`,
        width: 1200,
        height: 630,
        format: "png" as const,
      },
      seo: {
        title: `Post ${i + 1}`,
        description: `Description ${i + 1}`,
      },
    },
    body: "",
    rendered: undefined,
    filePath: `src/content/blog/${locale}/post-${i + 1}.mdx`,
  })) as CollectionEntry<"blog">[]
}

describe("content queries", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("getFeaturedBlogPosts", () => {
    it("returns featured posts for the locale sorted by date desc", async () => {
      const featuredEn = createMockBlogEntries("en", 3, true)
      const featuredEs = createMockBlogEntries("es", 2, true)

      mockGetCollection.mockImplementation(
        async (
          _collection: string,
          filter?: (entry: CollectionEntry<"blog">) => boolean
        ) => {
          const entries = [...featuredEn, ...featuredEs]
          return filter ? entries.filter(filter) : entries
        }
      )

      const result = await getFeaturedBlogPosts("en")

      expect(result).toHaveLength(3)
      expect(result.every((post) => post.data.locale === "en")).toBe(true)
      for (let i = 1; i < result.length; i++) {
        expect(result[i - 1].data.date.getTime()).toBeGreaterThanOrEqual(
          result[i].data.date.getTime()
        )
      }
    })

    it("excludes non-featured posts", async () => {
      const featured = createMockBlogEntries("en", 1, true)
      const regular = createMockBlogEntries("en", 4, false)

      mockGetCollection.mockImplementation(
        async (
          _collection: string,
          filter?: (entry: CollectionEntry<"blog">) => boolean
        ) => {
          const entries = [...featured, ...regular]
          return filter ? entries.filter(filter) : entries
        }
      )

      const result = await getFeaturedBlogPosts("en")

      expect(result).toHaveLength(1)
      expect(result[0].data.featured).toBe(true)
    })
  })
})
