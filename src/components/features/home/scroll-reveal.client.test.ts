import { beforeEach, describe, expect, it, vi } from "vitest"

describe("scroll reveal", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div data-reveal id="first"></div>
      <div data-reveal id="second"></div>
    `
    vi.restoreAllMocks()
    vi.resetModules()
  })

  it("re-initializes on astro:page-load", async () => {
    const observe = vi.fn()
    const unobserve = vi.fn()

    class MockIntersectionObserver {
      constructor(
        public callback: IntersectionObserverCallback,
        public options: IntersectionObserverInit
      ) {}

      observe() {
        observe()
      }

      unobserve() {
        unobserve()
      }

      disconnect() {}
    }

    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver)

    await import("./scroll-reveal.client")

    document.dispatchEvent(new Event("astro:page-load"))

    expect(observe).toHaveBeenCalledTimes(2)
  })

  it("marks elements visible without IntersectionObserver", async () => {
    vi.stubGlobal("IntersectionObserver", undefined)

    await import("./scroll-reveal.client")

    document.dispatchEvent(new Event("astro:page-load"))

    expect(document.getElementById("first")).toHaveAttribute(
      "data-reveal",
      "visible"
    )
    expect(document.getElementById("second")).toHaveAttribute(
      "data-reveal",
      "visible"
    )
  })
})
