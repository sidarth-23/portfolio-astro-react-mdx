import { expect, test } from "@playwright/test"

test.describe("Mobile TOC scrollspy", () => {
  test.skip(({ isMobile }) => !isMobile, "Mobile-only behavior")

  test("keeps section active while content is visible and updates mobile progress", async ({ page }) => {
    await page.goto("/en/projects/elecsavers-ecommerce-platform")

    const summary = page.locator("[data-toc-summary]")
    await expect(summary).toBeVisible()

    const tocItems = await page.evaluate(() => {
      return Array.from(document.querySelectorAll<HTMLElement>("article h2[id], article h3[id]")).map(
        (node) => ({
          id: node.id,
          top: node.getBoundingClientRect().top + window.scrollY,
        })
      )
    })
    expect(tocItems.length).toBeGreaterThan(1)

    const firstId = tocItems[0]?.id
    const secondTop = tocItems[1]?.top ?? Number.POSITIVE_INFINITY
    expect(firstId).toBeTruthy()
    if (!firstId) throw new Error("Expected first heading id")

    const initialProgress = await page.evaluate(() => {
      const node = document.querySelector<SVGCircleElement>("[data-toc-progress-value]")
      if (!node) return null
      return {
        offset: Number(node.style.strokeDashoffset || 0),
        circumference: Number(node.dataset.circumference || 0),
      }
    })
    expect(initialProgress).toBeTruthy()
    if (!initialProgress) throw new Error("Expected mobile progress indicator")

    await page.evaluate(({ start, end }) => {
      const top = Math.min(start + 260, Math.max(start + 40, end - 260))
      window.scrollTo({ top, behavior: "auto" })
    }, {
      start: tocItems[0]!.top,
      end: secondTop,
    })

    await expect.poll(async () => {
      return await page.evaluate((id) => {
        const heading = document.getElementById(id)
        return heading ? heading.getBoundingClientRect().top : null
      }, firstId)
    }).toBeLessThan(0)

    const tocToggle = page.locator("[data-toc='mobile'] > summary")
    await tocToggle.click()

    const firstLink = page.locator(`[data-toc='mobile'] [data-toc-link][href='#${firstId}']`)
    await expect(firstLink).toBeVisible()
    await expect(firstLink).toHaveClass(/text-foreground/)

    const isVisibleInsideContainer = await page.evaluate((id) => {
      const container = document.querySelector<HTMLElement>("[data-toc='mobile'] [data-toc-scroll-container]")
      const first = document.querySelector<HTMLElement>(`[data-toc='mobile'] [data-toc-link][href='#${id}']`)
      if (!container || !first) return false

      const containerRect = container.getBoundingClientRect()
      const firstRect = first.getBoundingClientRect()
      return firstRect.top >= containerRect.top && firstRect.bottom <= containerRect.bottom
    }, firstId)
    expect(isVisibleInsideContainer).toBe(true)

    await tocToggle.click()
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "auto" }))

    await expect.poll(async () => {
      return await page.evaluate(() => {
        const links = Array.from(
          document.querySelectorAll<HTMLAnchorElement>("[data-toc='mobile'] [data-toc-link]")
        )
        const activeIndexes = links
          .map((link, index) => ({ index, active: link.classList.contains("text-foreground") }))
          .filter((entry) => entry.active)
          .map((entry) => entry.index)

        const lastActive = activeIndexes.at(-1) ?? -1
        const expectedProgress = (lastActive + 1) / Math.max(1, links.length)

        const node = document.querySelector<SVGCircleElement>("[data-toc-progress-value]")
        if (!node) return false

        const circumference = Number(node.dataset.circumference || 0)
        const offset = Number(node.style.strokeDashoffset || 0)
        const actualProgress = circumference > 0 ? 1 - offset / circumference : 0
        return Math.abs(actualProgress - expectedProgress) < 0.02
      })
    }).toBe(true)

    await expect
      .poll(async () => (await summary.textContent())?.trim() ?? "")
      .not.toBe("")
  })
})
