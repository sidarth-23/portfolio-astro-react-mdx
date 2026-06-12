import { test, expect } from "./test"

test.describe("Global Search", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en")
  })

  test("opens with the trigger button and shows grouped results", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Search" }).click()

    const input = page.getByPlaceholder("Search posts, profile, sections...")
    await expect(input).toBeVisible()

    await input.fill("react")

    await expect(page.locator("[cmdk-group-heading]").first()).toBeVisible()
    await expect(page.locator("[cmdk-item]").first()).toBeVisible()
  })

  test("opens with Ctrl+K and closes with Escape", async ({ page }) => {
    await page.keyboard.press("ControlOrMeta+k")

    const input = page.getByPlaceholder("Search posts, profile, sections...")
    await expect(input).toBeVisible()

    await page.keyboard.press("Escape")
    await expect(input).not.toBeVisible()
  })

  test("highlights matches and navigates on selection", async ({ page }) => {
    await page.keyboard.press("ControlOrMeta+k")

    const input = page.getByPlaceholder("Search posts, profile, sections...")
    await input.fill("react")

    const firstItem = page.locator("[cmdk-item]").first()
    await expect(firstItem).toBeVisible()
    await expect(page.locator("[cmdk-item] mark").first()).toBeVisible()

    await firstItem.click()
    await expect(page).not.toHaveURL(/\/en\/?$/)
  })

  test("shows localized strings on the Spanish site", async ({ page }) => {
    await page.goto("/es")
    await page.keyboard.press("ControlOrMeta+k")

    await expect(
      page.getByPlaceholder("Buscar publicaciones, perfil, secciones...")
    ).toBeVisible()
    await expect(page.getByText("Escribe al menos 2 caracteres")).toBeVisible()
  })

  test("shows an empty state for nonsense queries", async ({ page }) => {
    await page.keyboard.press("ControlOrMeta+k")

    const input = page.getByPlaceholder("Search posts, profile, sections...")
    await input.fill("zzzznotfound")

    await expect(page.getByText("No results found")).toBeVisible()
  })
})
