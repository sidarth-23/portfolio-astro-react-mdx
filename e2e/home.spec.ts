import { test, expect } from "./test"

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

  test("loads sidebar avatar and hero illustration assets", async ({ page }) => {
    const failedRequests: string[] = []

    page.on("response", (response) => {
      const url = new URL(response.url())
      if (
        response.status() === 404 &&
        url.pathname.startsWith("/_astro/") &&
        url.pathname.match(/\.(svg|webp|png|jpg|jpeg|js|css)$/i)
      ) {
        failedRequests.push(response.url())
      }
    })

    await page.goto("/en")
    await page.waitForLoadState("networkidle")

    const avatar = page.getByRole("img", { name: "Sidarth G", exact: true })
    await expect(avatar).toBeVisible()
    const avatarBox = await avatar.boundingBox()
    expect(avatarBox).not.toBeNull()
    expect(avatarBox!.width).toBeGreaterThanOrEqual(78)
    expect(avatarBox!.width).toBeLessThanOrEqual(82)
    expect(avatarBox!.height).toBeGreaterThanOrEqual(78)
    expect(avatarBox!.height).toBeLessThanOrEqual(82)

    const hero = page.getByRole("img", { name: "Sidarth G — Software Developer" })
    await expect(hero).toBeVisible()
    const heroSrc = await hero.getAttribute("src")
    expect(heroSrc).toContain("hero-illustration")
    expect(heroSrc).toMatch(/\.svg$/i)
    const naturalWidth = await hero.evaluate((el: HTMLImageElement) => el.naturalWidth)
    expect(naturalWidth).toBeGreaterThan(0)

    expect(failedRequests).toHaveLength(0)
  })

  test("featured project image uses contained foreground over blur", async ({ page }) => {
    await page.goto("/en")
    await page.waitForLoadState("networkidle")

    const featuredLink = page.locator('a[href="/en/projects/elecsavers-ecommerce-platform"]').first()
    await expect(featuredLink).toBeVisible()

    const blurImage = featuredLink.locator("img[aria-hidden='true']")
    await expect(blurImage).toBeVisible()
    const blurClass = await blurImage.getAttribute("class")
    expect(blurClass).toContain("blur-2xl")
    expect(blurClass).toContain("scale-110")
    expect(blurClass).toContain("object-cover")

    const foregroundImage = featuredLink.locator('img[alt*="ElecSavers"]')
    await expect(foregroundImage).toBeVisible()
    const foregroundClass = await foregroundImage.getAttribute("class")
    expect(foregroundClass).toContain("object-contain")

    const wrapper = featuredLink.locator(".aspect-video")
    await expect(wrapper).toBeVisible()
    const wrapperBox = await wrapper.boundingBox()
    expect(wrapperBox).not.toBeNull()
    const ratio = wrapperBox!.width / wrapperBox!.height
    expect(ratio).toBeGreaterThanOrEqual(1.72)
    expect(ratio).toBeLessThanOrEqual(1.80)
  })
})
