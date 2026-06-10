import { describe, expect, it } from "vitest"
import { getBlurBackdropForegroundClass } from "./blur-backdrop-image"

describe("blur backdrop image", () => {
  it("keeps the foreground image contained in the reserved space", () => {
    expect(getBlurBackdropForegroundClass("transition")).toBe(
      "relative z-10 h-full w-full object-contain transition"
    )
  })
})
