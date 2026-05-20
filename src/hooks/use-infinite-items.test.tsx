import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { useInfiniteItems } from "./use-infinite-items"
import { QueryClientProvider } from "@tanstack/react-query"
import { createQueryClient } from "@/lib/query-client"
import type { ReactNode } from "react"

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={createQueryClient()}>{children}</QueryClientProvider>
)

describe("useInfiniteItems", () => {
  let mockFetch: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockFetch = vi.fn()
    global.fetch = mockFetch as unknown as typeof global.fetch
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("constructs correct fetch URL with all filters", async () => {
    mockFetch.mockResolvedValueOnce({
      json: () =>
        Promise.resolve({
          items: [{ id: 1 }],
          hasMore: false,
          total: 1,
        }),
      ok: true,
    })

    renderHook(
      () =>
        useInfiniteItems({
          endpoint: "/api/test",
          locale: "en",
          tags: ["react", "astro"],
          categories: ["frontend"],
          search: "hello",
          sort: "newest",
          limit: 10,
        }),
      { wrapper }
    )

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    const url = new URL(mockFetch.mock.calls[0][0] as string, "http://localhost")
    expect(url.pathname).toBe("/api/test")
    expect(url.searchParams.get("locale")).toBe("en")
    expect(url.searchParams.get("page")).toBe("1")
    expect(url.searchParams.get("limit")).toBe("10")
    expect(url.searchParams.get("tags")).toBe("react,astro")
    expect(url.searchParams.get("categories")).toBe("frontend")
    expect(url.searchParams.get("search")).toBe("hello")
    expect(url.searchParams.get("sort")).toBe("newest")
  })

  it("flattens paginated data into allItems", async () => {
    mockFetch
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            items: [{ id: 1 }, { id: 2 }],
            hasMore: true,
            total: 4,
          }),
        ok: true,
      })
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            items: [{ id: 3 }, { id: 4 }],
            hasMore: false,
            total: 4,
          }),
        ok: true,
      })

    const { result } = renderHook(
      () =>
        useInfiniteItems({
          endpoint: "/api/test",
          locale: "en",
          tags: [],
          categories: [],
          search: null,
          sort: null,
          limit: 2,
        }),
      { wrapper }
    )

    await waitFor(() => {
      expect(result.current.allItems).toHaveLength(2)
    })

    expect(result.current.allItems).toEqual([{ id: 1 }, { id: 2 }])
    expect(result.current.hasNextPage).toBe(true)

    // Simulate fetching next page by calling fetchNextPage directly
    await result.current.fetchNextPage()

    await waitFor(() => {
      expect(result.current.allItems).toHaveLength(4)
    })

    expect(result.current.allItems).toEqual([
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
    ])
    expect(result.current.hasNextPage).toBe(false)
  })

  it("changes query key when filters change", async () => {
    mockFetch.mockResolvedValue({
      json: () =>
        Promise.resolve({
          items: [],
          hasMore: false,
          total: 0,
        }),
      ok: true,
    })

    const { rerender } = renderHook(
      ({ search }: { search: string | null }) =>
        useInfiniteItems({
          endpoint: "/api/test",
          locale: "en",
          tags: ["react"],
          categories: ["frontend"],
          search,
          sort: "newest",
          limit: 10,
        }),
      {
        wrapper,
        initialProps: { search: "hello" },
      }
    )

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    const firstCall = mockFetch.mock.calls[0][0] as string
    expect(firstCall).toContain("search=hello")

    mockFetch.mockClear()
    rerender({ search: "world" })

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    const secondCall = mockFetch.mock.calls[0][0] as string
    expect(secondCall).toContain("search=world")
  })

  it("does not fetch when disabled", () => {
    renderHook(
      () =>
        useInfiniteItems({
          endpoint: "/api/test",
          locale: "en",
          tags: [],
          categories: [],
          search: null,
          sort: null,
          limit: 10,
          enabled: false,
        }),
      { wrapper }
    )

    expect(mockFetch).not.toHaveBeenCalled()
  })

  it("returns correct pagination state", async () => {
    mockFetch.mockResolvedValueOnce({
      json: () =>
        Promise.resolve({
          items: [{ id: 1 }],
          hasMore: true,
          total: 100,
        }),
      ok: true,
    })

    const { result } = renderHook(
      () =>
        useInfiniteItems({
          endpoint: "/api/test",
          locale: "en",
          tags: [],
          categories: [],
          search: null,
          sort: null,
          limit: 10,
        }),
      { wrapper }
    )

    expect(result.current.isPending).toBe(true)

    await waitFor(() => {
      expect(result.current.isPending).toBe(false)
    })

    expect(result.current.hasNextPage).toBe(true)
    expect(result.current.isFetchingNextPage).toBe(false)
    expect(result.current.allItems).toEqual([{ id: 1 }])
  })
})
