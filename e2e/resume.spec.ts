import { test, expect } from "./test"

test.describe("Resume", () => {
  test("loads at /resume with core layout blocks", async ({ page }) => {
    await page.goto("/resume")
    await expect(page).toHaveURL("/resume")
    await expect(page.locator("h1")).toHaveText("Sidarth G")
    await expect(
      page.getByRole("heading", { name: "Work History" })
    ).toBeVisible()
    await expect(
      page.getByRole("button", { name: "Copy Markdown" })
    ).toBeVisible()
    await expect(page.getByRole("link", { name: "Back to App" })).toBeVisible()
  })
})
