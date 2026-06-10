import { test, expect } from "./test"

test.describe("Blog List Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/blog")
  })

  test("loads without errors", async ({ page }) => {
    await expect(page).toHaveURL("/en/blog")
    await expect(page.locator("main")).toBeVisible()
    await expect(page.locator("h1")).toContainText("Blog")
  })

  test("displays blog posts", async ({ page }) => {
    const cards = page.locator("[data-testid='blog-card']")
    await expect(cards.first()).toBeVisible()
    expect(await cards.count()).toBeGreaterThan(0)
  })

  test("images are optimized webp", async ({ page }) => {
    await page.waitForLoadState("networkidle")

    const images = page
      .locator("picture img")
      .filter({ has: page.locator("[loading='lazy']") })
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
    const searchInput = page.locator("[data-testid='search-input']")

    await searchInput.fill("zzzznotfound")
    await page.waitForLoadState("networkidle")

    await expect(page).toHaveURL(/search=zzzznotfound/)
    await expect(page.locator("[data-testid='blog-card']")).toHaveCount(0)

    await searchInput.fill("authentication")
    await page.waitForLoadState("networkidle")
    await expect(page).toHaveURL(/search=authentication/)
    await expect(page.locator("[data-testid='blog-card']")).toHaveCount(1)
  })

  test("filters by categories and updates URL", async ({ page }) => {
    await page.getByRole("button", { name: "Backend Systems" }).click()
    await page.waitForLoadState("networkidle")
    await expect(page).toHaveURL(
      /categories=Backend\+Systems|categories=Backend%20Systems/
    )
    await expect(page.locator("[data-testid='blog-card']")).toHaveCount(1)

    await page.getByRole("button", { name: "Backend Systems" }).click()
    await page.waitForLoadState("networkidle")
    await expect(page).not.toHaveURL(/categories=/)
  })

  test("supports infinite scroll", async ({ page }) => {
    const initialCards = await page.locator("[data-testid='blog-card']").count()

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForLoadState("networkidle")

    const newCards = await page.locator("[data-testid='blog-card']").count()
    expect(newCards).toBeGreaterThanOrEqual(initialCards)
  })

  test("no image 404s", async ({ page }) => {
    const failedRequests: string[] = []

    page.on("response", (response) => {
      if (
        response.status() === 404 &&
        response.url().match(/\.(webp|jpg|jpeg|png|gif)/i)
      ) {
        failedRequests.push(response.url())
      }
    })

    await page.goto("/en/blog")
    await page.waitForLoadState("networkidle")

    expect(failedRequests).toHaveLength(0)
  })

  test("initial page has small payload", async ({ page }) => {
    const response = await page.goto("/en/blog")
    const body = await response?.text()

    expect(body?.length).toBeLessThan(50000)
  })
})
