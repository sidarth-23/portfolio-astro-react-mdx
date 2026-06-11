import { describe, expect, it } from "vitest"

import { filterBySearch, filterByTags, paginate } from "./serialization"

import type { SerializedBlogPost } from "./serialization"

const mockPosts: SerializedBlogPost[] = [
  {
    slug: "post-1",
    title: "Getting Started with Astro",
    description: "A beginner guide",
    date: "2024-01-01",
    tags: ["astro", "tutorial"],
    coverImage: { src: "/img1.webp", width: 600, height: 340 },
  },
  {
    slug: "post-2",
    title: "Advanced React Patterns",
    description: "Deep dive into React",
    date: "2024-02-01",
    tags: ["react", "advanced"],
    coverImage: { src: "/img2.webp", width: 600, height: 340 },
  },
  {
    slug: "post-3",
    title: "TypeScript Tips",
    description: "Best practices",
    date: "2024-03-01",
    tags: ["typescript", "tutorial"],
    coverImage: { src: "/img3.webp", width: 600, height: 340 },
  },
]

describe("filterBySearch", () => {
  it("returns all items when search is null", () => {
    expect(filterBySearch(mockPosts, null)).toHaveLength(3)
  })

  it("returns all items when search is empty", () => {
    expect(filterBySearch(mockPosts, "")).toHaveLength(3)
  })

  it("filters by title", () => {
    const result = filterBySearch(mockPosts, "astro")
    expect(result).toHaveLength(1)
    expect(result[0].slug).toBe("post-1")
  })

  it("filters by description", () => {
    const result = filterBySearch(mockPosts, "deep dive")
    expect(result).toHaveLength(1)
    expect(result[0].slug).toBe("post-2")
  })

  it("is case insensitive", () => {
    const result = filterBySearch(mockPosts, "ASTRO")
    expect(result).toHaveLength(1)
  })

  it("returns empty array for no matches", () => {
    expect(filterBySearch(mockPosts, "vue")).toHaveLength(0)
  })
})

describe("filterByTags", () => {
  it("returns all items when tags is null", () => {
    expect(filterByTags(mockPosts, null)).toHaveLength(3)
  })

  it("returns all items when tags is empty", () => {
    expect(filterByTags(mockPosts, [])).toHaveLength(3)
  })

  it("filters by single tag", () => {
    const result = filterByTags(mockPosts, ["tutorial"])
    expect(result).toHaveLength(2)
  })

  it("filters by multiple tags with OR logic", () => {
    const result = filterByTags(mockPosts, ["react", "typescript"])
    expect(result).toHaveLength(2)
  })

  it("returns empty array for non-matching tags", () => {
    expect(filterByTags(mockPosts, ["vue"])).toHaveLength(0)
  })
})

describe("paginate", () => {
  it("returns correct first page", () => {
    const result = paginate(mockPosts, 1, 2)
    expect(result.items).toHaveLength(2)
    expect(result.hasMore).toBe(true)
    expect(result.total).toBe(3)
  })

  it("returns correct last page", () => {
    const result = paginate(mockPosts, 2, 2)
    expect(result.items).toHaveLength(1)
    expect(result.hasMore).toBe(false)
    expect(result.total).toBe(3)
  })

  it("returns empty for out-of-bounds page", () => {
    const result = paginate(mockPosts, 10, 2)
    expect(result.items).toHaveLength(0)
    expect(result.hasMore).toBe(false)
  })

  it("handles empty array", () => {
    const result = paginate([], 1, 10)
    expect(result.items).toHaveLength(0)
    expect(result.hasMore).toBe(false)
    expect(result.total).toBe(0)
  })
})
