import { expect, test } from "@playwright/test"

test.describe("Mobile TOC scrollspy", () => {
  test.skip(({ isMobile }) => !isMobile, "Mobile-only behavior")

  test("updates mobile toc summary while scrolling and keeps active item in view", async ({ page }) => {
    await page.goto("/en/projects/elecsavers-ecommerce-platform")

    const summary = page.locator("[data-toc-summary]")
    await expect(summary).toBeVisible()

    const initialSummary = await summary.textContent()

    const headingIds = await page
      .locator("article h2[id], article h3[id]")
      .evaluateAll((nodes) => nodes.map((node) => (node as HTMLElement).id))
    expect(headingIds.length).toBeGreaterThan(1)

    const targetId = headingIds.at(-1)
    expect(targetId).toBeTruthy()
    if (!targetId) {
      throw new Error("Expected at least one heading id")
    }

    await page.evaluate((id) => {
      const target = document.getElementById(id)
      if (!target) return
      const top = target.getBoundingClientRect().top + window.scrollY - 120
      window.scrollTo({ top, behavior: "auto" })
    }, targetId)

    await expect
      .poll(async () => (await summary.textContent())?.trim() ?? "")
      .not.toBe((initialSummary ?? "").trim())

    const tocToggle = page.locator("[data-toc='mobile'] > summary")
    await tocToggle.click()

    const activeLink = page.locator("[data-toc='mobile'] [data-toc-link].text-foreground").first()
    await expect(activeLink).toBeVisible()

    const isActiveVisibleInsideContainer = await page.evaluate(() => {
      const container = document.querySelector<HTMLElement>("[data-toc='mobile'] [data-toc-scroll-container]")
      const active = document.querySelector<HTMLElement>("[data-toc='mobile'] [data-toc-link].text-foreground")
      if (!container || !active) return false

      const containerRect = container.getBoundingClientRect()
      const activeRect = active.getBoundingClientRect()
      return activeRect.top >= containerRect.top && activeRect.bottom <= containerRect.bottom
    })
    expect(isActiveVisibleInsideContainer).toBe(true)
  })
})
