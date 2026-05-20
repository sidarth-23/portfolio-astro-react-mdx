import { expect, test } from "@playwright/test"

test.describe("Code tabs", () => {
  test("renders tab menu and switches panels", async ({ page }) => {
    await page.goto("/en/projects/elecsavers-ecommerce-platform")

    const group = page.locator("[data-code-group]").first()
    await expect(group).toBeVisible()

    const tabs = group.locator('[role="tab"]')
    await expect(tabs).toHaveCount(2)
    await expect(tabs.nth(0)).toHaveText("schema.ts")
    await expect(tabs.nth(1)).toHaveText("queries.ts")

    const panels = group.locator('[role="tabpanel"]')
    await expect(panels).toHaveCount(2)
    await expect(panels.nth(0)).not.toHaveAttribute("hidden", "")
    await expect(panels.nth(1)).toHaveAttribute("hidden", "")

    await tabs.nth(1).click()

    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true")
    await expect(panels.nth(0)).toHaveAttribute("hidden", "")
    await expect(panels.nth(1)).not.toHaveAttribute("hidden", "")
  })
})
