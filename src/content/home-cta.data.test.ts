import { describe, expect, it } from "vitest"
import { homeCta } from "./home-cta.data"

describe("homeCta", () => {
  it("defines a shared primary url and profile path", () => {
    expect(homeCta.primaryUrl).toMatch(/^https?:\/\//)
    expect(homeCta.secondaryPath).toBe("/profile")
  })
})
