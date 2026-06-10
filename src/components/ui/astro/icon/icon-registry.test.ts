import { describe, expect, it } from "vitest"
import { iconRegistry, resolveIcon } from "./icon-registry"

describe("icon registry", () => {
  it("resolves brand links to the expected icons", () => {
    expect(resolveIcon(undefined, "https://github.com/sidarth-23")).toBe(
      iconRegistry.github
    )
    expect(resolveIcon(undefined, "https://linkedin.com/in/sidarth-g")).toBe(
      iconRegistry.linkedin
    )
    expect(resolveIcon(undefined, "https://x.com/sidarth")).toBe(
      iconRegistry.xBrand
    )
    expect(resolveIcon(undefined, "mailto:g.sidarth23@gmail.com")).toBe(
      iconRegistry.mail
    )
    expect(resolveIcon(undefined, "https://maps.app.goo.gl/foo")).toBe(
      iconRegistry["map-pin"]
    )
  })

  it("keeps lucide names for local icons", () => {
    expect(resolveIcon("x")).toBe(iconRegistry.x)
    expect(resolveIcon("arrow-left")).toBe(iconRegistry["arrow-left"])
    expect(resolveIcon("panel-left")).toBe(iconRegistry["panel-left"])
  })
})
