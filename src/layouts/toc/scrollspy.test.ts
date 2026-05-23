import { describe, expect, it } from "vitest"
import { getActiveHeadingHash } from "./scrollspy"

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
