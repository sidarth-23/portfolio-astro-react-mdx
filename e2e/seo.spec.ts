import { test, expect } from "./test"

const siteUrl = process.env.SITE_URL
if (!siteUrl) throw new Error("SITE_URL is required for SEO e2e tests")

test.describe("SEO meta tags", () => {
  test("/en emits canonical, og:url, and og:image with siteUrl", async ({
    page,
  }) => {
    await page.goto("/en")
    const canonical = await page
      .locator('link[rel="canonical"]')
      .getAttribute("href")
    expect(canonical).toBe(`${siteUrl}/en`)
    const ogUrl = await page
      .locator('meta[property="og:url"]')
      .getAttribute("content")
    expect(ogUrl).toBe(`${siteUrl}/en`)
    const ogImage = await page
      .locator('meta[property="og:image"]')
      .getAttribute("content")
    expect(ogImage).toBe(`${siteUrl}/og/og-home-en.png`)
  })

  test("/en/blog emits canonical and og:url with siteUrl", async ({ page }) => {
    await page.goto("/en/blog")
    const canonical = await page
      .locator('link[rel="canonical"]')
      .getAttribute("href")
    expect(canonical).toBe(`${siteUrl}/en/blog`)
    const ogUrl = await page
      .locator('meta[property="og:url"]')
      .getAttribute("content")
    expect(ogUrl).toBe(`${siteUrl}/en/blog`)
  })

  test("/en/rss.xml responds 200 and contains blog post links with siteUrl", async ({
    request,
  }) => {
    const response = await request.get("/en/rss.xml")
    expect(response.status()).toBe(200)
    const body = await response.text()
    expect(body).toContain(
      `${siteUrl}/en/blog/stop-trusting-the-client-a-real-world-guide-to-authentication`
    )
  })

  test("/sitemap-0.xml responds 200 and contains siteUrl loc entries", async ({
    request,
  }) => {
    const response = await request.get("/sitemap-0.xml")
    expect(response.status()).toBe(200)
    const body = await response.text()
    expect(body).toContain(`<loc>${siteUrl}/en/</loc>`)
  })
})
