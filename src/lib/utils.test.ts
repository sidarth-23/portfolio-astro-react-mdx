import { describe, expect, it } from "vitest"
import { cn, isActiveLink } from "./utils"

describe("cn", () => {
  it("merges tailwind classes correctly", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4")
  })

  it("handles conditional classes", () => {
    const isActive = true
    const isInactive = false
    expect(cn("base", isActive && "active", isInactive && "inactive")).toBe(
      "base active"
    )
  })

  it("handles arrays of classes", () => {
    expect(cn(["a", "b"], "c")).toBe("a b c")
  })

  it("returns empty string for no args", () => {
    expect(cn()).toBe("")
  })
})

describe("isActiveLink", () => {
  it("matches root path exactly", () => {
    expect(isActiveLink("/", "/")).toBe(true)
    expect(isActiveLink("/en", "/")).toBe(false)
  })

  it("matches root path with trailing slash normalization", () => {
    expect(isActiveLink("/en/", "/en")).toBe(true)
    expect(isActiveLink("/en", "/en/")).toBe(true)
    expect(isActiveLink("/en/", "/en/")).toBe(true)
  })

  it("matches exact path", () => {
    expect(isActiveLink("/en/blog", "/en/blog")).toBe(true)
    expect(isActiveLink("/en/blog", "/en/projects")).toBe(false)
  })

  it("prefix-matches for non-root paths with multiple segments", () => {
    expect(isActiveLink("/en/blog/post-1", "/en/blog")).toBe(true)
    expect(isActiveLink("/en/blog", "/en/blog")).toBe(true)
    expect(isActiveLink("/en/blog/post-1/", "/en/blog/")).toBe(true)
  })

  it("does not prefix-match root-like paths", () => {
    expect(isActiveLink("/en/projects", "/en")).toBe(false)
    expect(isActiveLink("/es/blog", "/es")).toBe(false)
  })

  it("matches single segment paths exactly", () => {
    expect(isActiveLink("/about", "/about")).toBe(true)
    expect(isActiveLink("/about/team", "/about")).toBe(false)
  })
})
