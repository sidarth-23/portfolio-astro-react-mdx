import { describe, expect, it } from "vitest"
import { getActiveHeadingHash, getScrollspyOffset } from "./scrollspy"

describe("getActiveHeadingHash", () => {
  it("returns first heading when viewport has not reached any heading", () => {
    const hash = getActiveHeadingHash([
      { id: "stack", absoluteTop: 200 },
      { id: "what-it-does", absoluteTop: 420 },
    ], 0)

    expect(hash).toBe("#stack")
  })

  it("returns last heading that crossed the offset", () => {
    const hash = getActiveHeadingHash([
      { id: "stack", absoluteTop: 80 },
      { id: "what-it-does", absoluteTop: 140 },
      { id: "themes", absoluteTop: 420 },
    ], 100)

    expect(hash).toBe("#what-it-does")
  })

  it("supports custom offset", () => {
    const hash = getActiveHeadingHash(
      [
        { id: "stack", absoluteTop: 160 },
        { id: "what-it-does", absoluteTop: 280 },
      ],
      100,
      80
    )

    expect(hash).toBe("#stack")
  })

  it("returns empty string when there are no headings", () => {
    expect(getActiveHeadingHash([], 0)).toBe("")
  })
})

describe("getScrollspyOffset", () => {
  it("uses a smaller offset on short mobile viewports", () => {
    expect(getScrollspyOffset(640)).toBe(128)
  })

  it("clamps to a minimum offset", () => {
    expect(getScrollspyOffset(300)).toBe(72)
  })

  it("clamps to a maximum offset", () => {
    expect(getScrollspyOffset(1200)).toBe(140)
  })
})
