import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { renderHook, waitFor } from "@testing-library/react"
import React from "react"
import { describe, expect, it, vi, beforeEach } from "vitest"

import type { BlogListingItem, ListingResponse } from "@/lib/api/listing-api"

import { useListingQuery } from "./use-listing-query"

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children
    )
  }
}

function createMockListingResponse(
  page: number,
  total: number = 24
): ListingResponse<BlogListingItem> {
  const items = Array.from(
    { length: Math.min(12, total - (page - 1) * 12) },
    (_, i) => ({
      slug: `post-${(page - 1) * 12 + i + 1}`,
      title: `Post ${(page - 1) * 12 + i + 1}`,
      description: `Description ${(page - 1) * 12 + i + 1}`,
      date: new Date().toISOString(),
      tags: ["astro"],
      coverImage: {
        src: "/test.webp",
        srcSet: "/test-400.webp 400w",
        sizes: "100vw",
        width: 600,
        height: 340,
        alt: "Test",
      },
    })
  )

  return {
    items,
    hasMore: page * 12 < total,
    total,
    page,
  }
}

describe("useListingQuery", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockClear()
  })

  it("uses initialData when provided", async () => {
    const initialData = createMockListingResponse(1)

    const { result } = renderHook(
      () =>
        useListingQuery<BlogListingItem>({
          endpoint: "/api/blog.json",
          locale: "en",
          initialData,
        }),
      { wrapper: createWrapper() }
    )

    expect(result.current.allItems).toHaveLength(12)
    expect(result.current.isPending).toBe(false)
  })

  it("fetches from API when no initialData", async () => {
    const mockResponse = createMockListingResponse(1)
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response)

    const { result } = renderHook(
      () =>
        useListingQuery<BlogListingItem>({
          endpoint: "/api/blog.json",
          locale: "en",
        }),
      { wrapper: createWrapper() }
    )

    expect(result.current.isPending).toBe(true)

    await waitFor(() => {
      expect(result.current.isPending).toBe(false)
    })

    expect(result.current.allItems).toHaveLength(12)
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/blog.json")
    )
  })

  it("includes search params in API request", async () => {
    const mockResponse = createMockListingResponse(1)
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response)

    renderHook(
      () =>
        useListingQuery<BlogListingItem>({
          endpoint: "/api/blog.json",
          locale: "en",
          search: "astro",
          tags: ["react", "typescript"],
          categories: ["Frontend"],
          sort: "newest",
        }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled()
    })

    const callUrl = vi.mocked(fetch).mock.calls[0][0] as string
    expect(callUrl).toContain("search=astro")
    expect(callUrl).toContain("tags=react%2Ctypescript")
    expect(callUrl).toContain("categories=Frontend")
    expect(callUrl).toContain("sort=newest")
  })

  it("fetches next page on scroll", async () => {
    const initialData = createMockListingResponse(1)
    const page2Response = createMockListingResponse(2)

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => page2Response,
    } as Response)

    const { result } = renderHook(
      () =>
        useListingQuery<BlogListingItem>({
          endpoint: "/api/blog.json",
          locale: "en",
          initialData,
        }),
      { wrapper: createWrapper() }
    )

    expect(result.current.hasNextPage).toBe(true)

    // Mock the second page response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        items: Array.from({ length: 12 }, (_, i) => ({
          slug: `post-${i + 13}`,
          title: `Post ${i + 13}`,
          description: `Description ${i + 13}`,
          date: new Date().toISOString(),
          tags: ["astro"],
          coverImage: {
            src: "/test.webp",
            srcSet: "/test-400.webp 400w",
            sizes: "100vw",
            width: 600,
            height: 340,
            alt: "Test",
          },
        })),
        hasMore: false,
        total: 24,
        page: 2,
      }),
    } as Response)

    // Simulate fetching next page
    result.current.fetchNextPage()

    await waitFor(() => {
      expect(result.current.isFetchingNextPage).toBe(false)
    })

    expect(result.current.allItems).toHaveLength(24)
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining("page=2"))
  })

  it("stops fetching when no more pages", async () => {
    const initialData = createMockListingResponse(1, 5) // Only 5 items total

    const { result } = renderHook(
      () =>
        useListingQuery<BlogListingItem>({
          endpoint: "/api/blog.json",
          locale: "en",
          initialData,
        }),
      { wrapper: createWrapper() }
    )

    expect(result.current.hasNextPage).toBe(false)
  })

  it("handles API errors gracefully", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"))

    const { result } = renderHook(
      () =>
        useListingQuery<BlogListingItem>({
          endpoint: "/api/blog.json",
          locale: "en",
        }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toBeDefined()
  })

  it("refetches when filters change", async () => {
    const mockResponse = createMockListingResponse(1)
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response)

    const { result, rerender } = renderHook(
      ({ search }) =>
        useListingQuery<BlogListingItem>({
          endpoint: "/api/blog.json",
          locale: "en",
          search,
        }),
      {
        wrapper: createWrapper(),
        initialProps: { search: "" },
      }
    )

    await waitFor(() => {
      expect(result.current.isPending).toBe(false)
    })

    expect(mockFetch).toHaveBeenCalledTimes(1)

    // Change search term
    rerender({ search: "astro" })

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2)
    })

    const lastCall = vi.mocked(fetch).mock.calls[1][0] as string
    expect(lastCall).toContain("search=astro")
  })
})
