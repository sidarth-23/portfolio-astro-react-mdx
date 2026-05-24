import { expect, test } from "./test"

test.describe("Desktop TOC scrollspy", () => {
  test.skip(({ isMobile }) => isMobile, "Desktop-only behavior")

  test("transitions active links, follows latest active link in container, and does not mutate hash on scroll", async ({ page }) => {
    await page.goto("/en/projects/elecsavers-ecommerce-platform")

    const initialUrl = page.url()
    const desktopLinks = page.locator("[data-toc='desktop'] [data-toc-link]")
    await expect(desktopLinks.first()).toBeVisible()

    const headings = await page.evaluate(() => {
      return Array.from(document.querySelectorAll<HTMLElement>("article h2[id], article h3[id]")).map(
        (node) => ({ id: node.id, top: node.getBoundingClientRect().top + window.scrollY })
      )
    })

    expect(headings.length).toBeGreaterThan(2)
    const firstId = headings[0]?.id
    const lastId = headings.at(-1)?.id
    expect(firstId).toBeTruthy()
    expect(lastId).toBeTruthy()
    if (!firstId || !lastId) throw new Error("Expected heading ids")

    await expect(page.locator(`[data-toc='desktop'] [data-toc-link][href='#${firstId}']`)).toHaveClass(
      /text-foreground/
    )

    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "auto" }))
    await expect(page).toHaveURL(initialUrl)

    await expect(page.locator(`[data-toc='desktop'] [data-toc-link][href='#${lastId}']`)).toHaveClass(
      /text-foreground/
    )

    await expect.poll(async () => {
      return await page.evaluate((id) => {
        const container = document.querySelector<HTMLElement>("[data-toc='desktop'] [data-toc-scroll-container]")
        const link = document.querySelector<HTMLElement>(`[data-toc='desktop'] [data-toc-link][href='#${id}']`)
        if (!container || !link) return false

        const containerRect = container.getBoundingClientRect()
        const linkRect = link.getBoundingClientRect()
        return linkRect.top >= containerRect.top && linkRect.bottom <= containerRect.bottom
      }, lastId)
    }).toBe(true)
  })
})
