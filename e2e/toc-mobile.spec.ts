import { expect, test } from "@playwright/test"

test.describe("Mobile TOC scrollspy", () => {
  test("updates mobile toc summary while scrolling", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto("/en/projects/elecsavers-ecommerce-platform")

    const summary = page.locator("[data-toc-summary]")
    await expect(summary).toBeVisible()

    const initialSummary = await summary.textContent()

    const headings = page.locator("article h2[id], article h3[id]")
    await expect(headings.nth(1)).toBeVisible()
    await headings.nth(1).scrollIntoViewIfNeeded()

    await expect
      .poll(async () => (await summary.textContent())?.trim() ?? "")
      .not.toBe((initialSummary ?? "").trim())
  })
})
