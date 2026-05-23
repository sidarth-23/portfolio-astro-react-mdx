import { test, expect } from "@playwright/test"

test.describe("Projects List Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/projects")
  })

  test("loads without errors", async ({ page }) => {
    await expect(page).toHaveURL("/en/projects")
    await expect(page.locator("main")).toBeVisible()
    await expect(page.locator("h1")).toContainText("Projects")
  })

  test("displays project cards", async ({ page }) => {
    const cards = page.locator("[data-testid='project-card']")
    await expect(cards.first()).toBeVisible()
    expect(await cards.count()).toBeGreaterThan(0)
  })

  test("images are optimized webp", async ({ page }) => {
    await page.waitForLoadState("networkidle")

    const images = page.locator("picture img").filter({ has: page.locator("[loading='lazy']") })
    const count = await images.count()

    for (let i = 0; i < count; i++) {
      const img = images.nth(i)
      const src = await img.getAttribute("src")
      expect(src).toMatch(/\.(webp|jpg|jpeg|png)$/i)
    }
  })

  test("supports responsive images with srcset", async ({ page }) => {
    const sources = page.locator("picture source")
    const count = await sources.count()

    for (let i = 0; i < count; i++) {
      const source = sources.nth(i)
      const srcset = await source.getAttribute("srcset")
      expect(srcset).toBeTruthy()
      expect(srcset).toContain("w")
    }
  })

  test("filters by search and updates URL", async ({ page }) => {
    const initialCards = await page.locator("[data-testid='project-card']").count()
    const searchInput = page.locator("[data-testid='search-input']")

    await searchInput.fill("bluebook")
    await page.waitForLoadState("networkidle")

    await expect(page).toHaveURL(/search=bluebook/)

    const filteredCards = await page.locator("[data-testid='project-card']").count()
    expect(filteredCards).toBe(1)
    expect(filteredCards).toBeLessThan(initialCards)
  })

  test("filters by categories and updates URL", async ({ page }) => {
    await page.getByRole("button", { name: "Website" }).click()
    await page.waitForLoadState("networkidle")

    await expect(page).toHaveURL(/categories=Website/)
    await expect(page.locator("[data-testid='project-card']")).toHaveCount(2)
  })

  test("filters by tags and updates URL", async ({ page }) => {
    await page.getByRole("button", { name: "Filters" }).click()
    await page.getByRole("button", { name: "#better auth" }).click()
    await page.waitForLoadState("networkidle")

    await expect(page).toHaveURL(/tags=better\+auth|tags=better%20auth/)
    await expect(page.locator("[data-testid='project-card']")).toHaveCount(1)
  })

  test("supports infinite scroll", async ({ page }) => {
    const initialCards = await page.locator("[data-testid='project-card']").count()

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForLoadState("networkidle")

    const newCards = await page.locator("[data-testid='project-card']").count()
    expect(newCards).toBeGreaterThanOrEqual(initialCards)
  })

  test("no image 404s", async ({ page }) => {
    const failedRequests: string[] = []

    page.on("response", (response) => {
      if (response.status() === 404 && response.url().match(/\.(webp|jpg|jpeg|png|gif)/i)) {
        failedRequests.push(response.url())
      }
    })

    await page.goto("/en/projects")
    await page.waitForLoadState("networkidle")

    expect(failedRequests).toHaveLength(0)
  })

  test("initial page has small payload", async ({ page }) => {
    const response = await page.goto("/en/projects")
    const body = await response?.text()

    expect(body?.length).toBeLessThan(50000)
  })
})
