import { describe, expect, it } from "vitest"
import { getActiveHeadingHash, getScrollspyOffset } from "./scrollspy"

describe("getActiveHeadingHash", () => {
  it("returns first heading when viewport has not reached any heading", () => {
    const hash = getActiveHeadingHash([
      { id: "stack", top: 200 },
      { id: "what-it-does", top: 420 },
    ])

    expect(hash).toBe("#stack")
  })

  it("returns last heading that crossed the offset", () => {
    const hash = getActiveHeadingHash([
      { id: "stack", top: -40 },
      { id: "what-it-does", top: 20 },
      { id: "themes", top: 300 },
    ])

    expect(hash).toBe("#what-it-does")
  })

  it("supports custom offset", () => {
    const hash = getActiveHeadingHash(
      [
        { id: "stack", top: 60 },
        { id: "what-it-does", top: 180 },
      ],
      80
    )

    expect(hash).toBe("#stack")
  })

  it("returns empty string when there are no headings", () => {
    expect(getActiveHeadingHash([])).toBe("")
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
