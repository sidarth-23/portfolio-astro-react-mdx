import { describe, expect, it } from "vitest"

import {
  getActiveHeadingHash,
  getActiveHeadingIds,
  getScrollspyOffset,
} from "./scrollspy"

describe("getActiveHeadingHash", () => {
  it("returns first heading when viewport has not reached any heading", () => {
    const hash = getActiveHeadingHash(
      [
        { id: "stack", absoluteTop: 200 },
        { id: "what-it-does", absoluteTop: 420 },
      ],
      0
    )

    expect(hash).toBe("#stack")
  })

  it("returns last heading that crossed the offset", () => {
    const hash = getActiveHeadingHash(
      [
        { id: "stack", absoluteTop: 80 },
        { id: "what-it-does", absoluteTop: 140 },
        { id: "themes", absoluteTop: 420 },
      ],
      100
    )

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

describe("getActiveHeadingIds", () => {
  it("keeps a heading active while its content section is visible", () => {
    const ids = getActiveHeadingIds(
      [
        { id: "intro", absoluteTop: 100 },
        { id: "install", absoluteTop: 800 },
        { id: "faq", absoluteTop: 1500 },
      ],
      500,
      900,
      120
    )

    expect(ids).toEqual(["intro", "install"])
  })

  it("returns multiple active headings when viewport spans a boundary", () => {
    const ids = getActiveHeadingIds(
      [
        { id: "intro", absoluteTop: 100 },
        { id: "setup", absoluteTop: 450 },
        { id: "usage", absoluteTop: 900 },
      ],
      350,
      800,
      120
    )

    expect(ids).toEqual(["setup", "usage"])
  })

  it("returns fallback nearest heading when viewport misses sections", () => {
    const ids = getActiveHeadingIds(
      [
        { id: "intro", absoluteTop: 500 },
        { id: "install", absoluteTop: 1200 },
      ],
      0,
      300,
      72
    )

    expect(ids).toEqual(["intro"])
  })

  it("uses deterministic nearest fallback in large gaps", () => {
    const ids = getActiveHeadingIds(
      [
        { id: "a", absoluteTop: 100 },
        { id: "b", absoluteTop: 900 },
        { id: "c", absoluteTop: 2300 },
      ],
      1200,
      180,
      72
    )

    expect(ids).toEqual(["b"])
  })

  it("applies offset consistently for small and large viewports", () => {
    const headings = [
      { id: "a", absoluteTop: 80 },
      { id: "b", absoluteTop: 420 },
      { id: "c", absoluteTop: 900 },
    ]

    expect(
      getActiveHeadingIds(headings, 260, 420, getScrollspyOffset(420))
    ).toEqual(["a", "b"])
    expect(
      getActiveHeadingIds(headings, 260, 1200, getScrollspyOffset(1200))
    ).toEqual(["a", "b", "c"])
  })
})
