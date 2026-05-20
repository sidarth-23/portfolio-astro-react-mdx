import { test, expect } from "@playwright/test"

test.describe("Homepage", () => {
  test("loads at /en", async ({ page }) => {
    await page.goto("/en")
    await expect(page).toHaveURL("/en")
  })

  test("has navigation elements", async ({ page }) => {
    await page.goto("/en")
    await expect(page.locator("nav")).toBeVisible()
  })

  test("has main content", async ({ page }) => {
    await page.goto("/en")
    await expect(page.locator("main")).toBeVisible()
  })

  test("page title is set", async ({ page }) => {
    await page.goto("/en")
    await expect(page).toHaveTitle(/.+/)
  })
})
