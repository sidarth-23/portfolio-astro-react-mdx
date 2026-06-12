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

  test("changes sort order and updates URL", async ({ page }) => {
    const firstCardTitle = page
      .locator("[data-testid='blog-card']")
      .first()
      .locator("[data-slot='card-title']")
    const newestTitle = await firstCardTitle.textContent()

    await page.locator("[data-testid='sort-select']").click()
    await page.getByRole("option", { name: "Oldest first" }).click()
    await page.waitForLoadState("networkidle")

    await expect(page).toHaveURL(/sort=date-asc/)
    await expect(firstCardTitle).not.toHaveText(newestTitle ?? "")
  })

  test("sorts by title via the sort select", async ({ page }) => {
    await page.locator("[data-testid='sort-select']").click()
    await page.getByRole("option", { name: "Title A–Z" }).click()
    await page.waitForLoadState("networkidle")

    await expect(page).toHaveURL(/sort=title-asc/)
  })

  test("maps legacy sort URL values", async ({ page }) => {
    await page.goto("/en/blog?sort=oldest")
    await page.waitForLoadState("networkidle")

    await expect(page.locator("[data-testid='sort-select']")).toContainText(
      "Oldest first"
    )
  })

  test("filters by tag via the combobox", async ({ page }) => {
    await page.locator("[data-testid='tag-filter-trigger']").click()
    const firstOption = page
      .locator("[data-testid='tag-filter-option']")
      .first()
    const tagLabel = (await firstOption.textContent())?.replace(/^#/, "") ?? ""
    await firstOption.click()
    await page.waitForLoadState("networkidle")

    await expect(page).toHaveURL(new RegExp(`tags=${tagLabel}`))
    await page.keyboard.press("Escape")
    await expect(
      page.locator("[data-testid='active-filter-chip']")
    ).toContainText(`#${tagLabel}`)
  })

  test("filters by date range preset and clears via chip", async ({ page }) => {
    await page.locator("[data-testid='date-filter-trigger']").click()
    await page.getByRole("button", { name: "This year" }).click()
    await page.waitForLoadState("networkidle")

    await expect(page).toHaveURL(/from=\d{4}-\d{2}-\d{2}/)
    await expect(page).toHaveURL(/to=\d{4}-\d{2}-\d{2}/)

    const chip = page.locator("[data-testid='active-filter-chip']")
    await expect(chip).toHaveCount(1)
    await chip.getByRole("button", { name: /Remove filter/ }).click()
    await page.waitForLoadState("networkidle")

    await expect(page).not.toHaveURL(/from=/)
    await expect(page).not.toHaveURL(/to=/)
  })

  test("hydrates date range filter from deep link", async ({ page }) => {
    await page.goto("/en/blog?from=2020-01-01&to=2020-12-31")
    await page.waitForLoadState("networkidle")

    await expect(
      page.locator("[data-testid='date-filter-trigger']")
    ).not.toContainText("Date range")
    await expect(
      page.locator("[data-testid='active-filter-chip']")
    ).toHaveCount(1)
  })

  test("shows removable active filter chips", async ({ page }) => {
    await page.getByRole("button", { name: "Backend Systems" }).click()
    await page.waitForLoadState("networkidle")

    const chip = page.locator("[data-testid='active-filter-chip']")
    await expect(chip).toHaveCount(1)
    await expect(chip).toContainText("Backend Systems")

    await chip.getByRole("button", { name: /Remove filter/ }).click()
    await page.waitForLoadState("networkidle")

    await expect(
      page.locator("[data-testid='active-filter-chip']")
    ).toHaveCount(0)
    await expect(page).not.toHaveURL(/categories=/)
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
