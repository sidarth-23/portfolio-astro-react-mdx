import { beforeEach, describe, expect, it, vi } from "vitest"

const show = vi.fn()
const hide = vi.fn()
const config = vi.fn()

vi.mock("topbar", () => ({
  default: {
    show,
    hide,
    config,
  },
}))

describe("initNavigationTopLoader", () => {
  beforeEach(() => {
    vi.resetModules()
    show.mockReset()
    hide.mockReset()
    config.mockReset()
    document.body.innerHTML = ""
    document.documentElement.removeAttribute(
      "data-navigation-top-loader-initialized"
    )
  })

  it("wires astro navigation events to topbar", async () => {
    const { initNavigationTopLoader } = await import("./top-loader")
    initNavigationTopLoader()
    initNavigationTopLoader()

    expect(config).not.toHaveBeenCalled()

    document.dispatchEvent(new Event("astro:before-preparation"))
    expect(config).toHaveBeenCalledTimes(1)
    expect(show).toHaveBeenCalledTimes(1)

    document.dispatchEvent(new Event("astro:page-load"))
    expect(hide).toHaveBeenCalledTimes(1)
  })
})
