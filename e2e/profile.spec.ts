import { test, expect } from "@playwright/test"

test.describe("Profile Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/profile")
  })

  test("loads at /en/profile", async ({ page }) => {
    await expect(page).toHaveURL("/en/profile")
  })

  test("has profile heading", async ({ page }) => {
    await expect(
      page.locator("h1, h2", { hasText: /Profile|About/i })
    ).toBeVisible()
  })

  test("experience section is visible with entries", async ({ page }) => {
    const experienceHeading = page.locator("h2", { hasText: "Experience" })
    await expect(experienceHeading).toBeVisible()

    // Experience section should contain at least one company name
    const experienceSection = page.locator("section").filter({
      has: page.locator("h2", { hasText: "Experience" }),
    })
    await expect(experienceSection).toBeVisible()

    // Should have timeline items or company names visible
    const companyNames = experienceSection.locator("text=/Company|Truvanta|IBM|Google/i")
    await expect(companyNames.first()).toBeVisible()
  })

  test("experience entries have roles and highlights", async ({ page }) => {
    const experienceSection = page.locator("section").filter({
      has: page.locator("h2", { hasText: "Experience" }),
    })

    // Should have role titles
    const roleTitles = experienceSection.locator("h3, h4").filter({
      hasText: /Developer|Engineer|Consultant/i,
    })
    await expect(roleTitles.first()).toBeVisible()

    // Should have highlights/bullet points
    const highlights = experienceSection.locator("ul li")
    await expect(highlights.first()).toBeVisible()
  })

  test("technologies and skills section is visible", async ({ page }) => {
    const skillsHeading = page.locator("h2", { hasText: /Technologies|Skills/i })
    await expect(skillsHeading).toBeVisible()
  })

  test("certifications section is visible", async ({ page }) => {
    const certificationsHeading = page.locator("h2", { hasText: "Certifications" })
    await expect(certificationsHeading).toBeVisible()
  })
})
