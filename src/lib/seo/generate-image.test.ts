import { describe, expect, it } from "vitest"

import { clampText, hasCoverImage, siteUrlToLabel } from "./generate-image"

describe("clampText", () => {
  it("returns text unchanged when under max length", () => {
    const text = "Short text"
    expect(clampText(text, 60)).toBe("Short text")
  })

  it("truncates text and adds ellipsis when over max length", () => {
    const text =
      "This is a very long text that definitely exceeds the maximum length allowed"
    const result = clampText(text, 20)
    expect(result.length).toBeLessThanOrEqual(20)
    expect(result.endsWith("…")).toBe(true)
  })

  it("normalizes whitespace before checking length", () => {
    const text = "Text    with   extra   spaces"
    expect(clampText(text, 60)).toBe("Text with extra spaces")
  })

  it("trims whitespace from ends", () => {
    const text = "  Trimmed text  "
    expect(clampText(text, 60)).toBe("Trimmed text")
  })

  it("returns single word unchanged if under limit", () => {
    expect(clampText("Hello", 60)).toBe("Hello")
  })

  it("handles exact length text", () => {
    const text = "a".repeat(60)
    expect(clampText(text, 60)).toBe(text)
  })

  it("handles text at max length minus 1", () => {
    const text = "a".repeat(59)
    expect(clampText(text, 60)).toBe(text)
  })

  it("handles text exactly one over max length", () => {
    const text = "a".repeat(61)
    const result = clampText(text, 60)
    expect(result.length).toBe(60)
    expect(result.endsWith("…")).toBe(true)
  })
})

describe("hasCoverImage", () => {
  it("returns true for a non-empty image data url", () => {
    expect(hasCoverImage("data:image/png;base64,abc")).toBe(true)
  })

  it("returns false when image data url is missing", () => {
    expect(hasCoverImage(undefined)).toBe(false)
  })

  it("returns false for whitespace-only image data url", () => {
    expect(hasCoverImage("   ")).toBe(false)
  })
})

describe("siteUrlToLabel", () => {
  it("extracts hostname from a URL with path", () => {
    expect(siteUrlToLabel("https://example.test/path")).toBe("example.test")
  })
})
