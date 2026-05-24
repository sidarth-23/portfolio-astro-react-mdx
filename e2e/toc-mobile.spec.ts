import { expect, test } from "@playwright/test"

test.describe("Mobile TOC scrollspy", () => {
  test.skip(({ isMobile }) => !isMobile, "Mobile-only behavior")

  test("updates active state reliably and only autoscrolls list when panel is open", async ({ page }) => {
    await page.goto("/en/projects/elecsavers-ecommerce-platform")

    const summary = page.locator("[data-toc-summary]")
    await expect(summary).toBeVisible()
    const initialUrl = page.url()

    const tocItems = await page.evaluate(() => {
      return Array.from(document.querySelectorAll<HTMLElement>("article h2[id], article h3[id]")).map(
        (node) => ({
          id: node.id,
          top: node.getBoundingClientRect().top + window.scrollY,
        })
      )
    })
    expect(tocItems.length).toBeGreaterThan(2)

    const firstId = tocItems[0]?.id
    const secondId = tocItems[1]?.id
    const lastId = tocItems.at(-1)?.id
    expect(firstId).toBeTruthy()
    expect(secondId).toBeTruthy()
    expect(lastId).toBeTruthy()
    if (!firstId || !secondId || !lastId) throw new Error("Expected heading ids")

    await page.evaluate(({ start, end }) => {
      const top = Math.min(start + 260, Math.max(start + 40, end - 260))
      window.scrollTo({ top, behavior: "auto" })
    }, {
      start: tocItems[0]!.top,
      end: tocItems[1]!.top,
    })

    await expect.poll(async () => {
      return await page.evaluate((id) => {
        const heading = document.getElementById(id)
        return heading ? heading.getBoundingClientRect().top : null
      }, firstId)
    }).toBeLessThan(0)

    await expect(page).toHaveURL(initialUrl)

    await expect.poll(async () => {
      return await page.evaluate((id) => {
        const link = document.querySelector<HTMLElement>(`[data-toc='mobile'] [data-toc-link][href='#${id}']`)
        return Boolean(link?.classList.contains("text-foreground"))
      }, firstId)
    }).toBe(true)

    const closedScrollTop = await page.evaluate(() => {
      const container = document.querySelector<HTMLElement>("[data-toc='mobile'] [data-toc-scroll-container]")
      return container?.scrollTop ?? 0
    })

    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "auto" }))

    await expect(page).toHaveURL(initialUrl)

    await expect.poll(async () => {
      return await page.evaluate(() => {
        const links = Array.from(
          document.querySelectorAll<HTMLAnchorElement>("[data-toc='mobile'] [data-toc-link]")
        )
        return links.some((link) => link.classList.contains("text-foreground"))
      })
    }).toBe(true)

    const closedScrollTopAfter = await page.evaluate(() => {
      const container = document.querySelector<HTMLElement>("[data-toc='mobile'] [data-toc-scroll-container]")
      return container?.scrollTop ?? 0
    })
    expect(Math.abs(closedScrollTopAfter - closedScrollTop)).toBeLessThan(2)

    const tocToggle = page.locator("[data-toc='mobile'] > summary")
    await tocToggle.click()

    await expect.poll(async () => {
      return await page.evaluate((id) => {
        const container = document.querySelector<HTMLElement>("[data-toc='mobile'] [data-toc-scroll-container]")
        const link = document.querySelector<HTMLElement>(`[data-toc='mobile'] [data-toc-link][href='#${id}']`)
        if (!container || !link) return false

        const containerRect = container.getBoundingClientRect()
        const linkRect = link.getBoundingClientRect()
        return linkRect.top >= containerRect.top && linkRect.bottom <= containerRect.bottom
      }, lastId)
    }).toBe(true)

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

    await expect.poll(async () => (await summary.textContent())?.trim() ?? "").not.toBe("")

    await page.locator(`[data-toc='mobile'] [data-toc-link][href='#${secondId}']`).click()
    await expect(page).toHaveURL(new RegExp(`#${secondId}$`))
  })
})
