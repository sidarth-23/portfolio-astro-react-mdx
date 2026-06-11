import { readdirSync } from "node:fs"
import { join } from "node:path"

import { test, expect } from "./test"

import type { Page } from "@playwright/test"

const siteUrl = process.env.SITE_URL
if (!siteUrl) throw new Error("SITE_URL is required for SEO e2e tests")

const locales = ["en", "es", "fr"] as const

function collectMdxSlugs(directory: string, prefix = ""): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const nextPrefix = prefix ? `${prefix}/${entry.name}` : entry.name

    if (entry.isDirectory()) {
      return collectMdxSlugs(join(directory, entry.name), nextPrefix)
    }

    if (!entry.isFile() || !entry.name.endsWith(".mdx")) {
      return []
    }

    return [nextPrefix.slice(0, -4)]
  })
}

async function expectSeoTags(
  page: Page,
  pathname: string,
  locale: string,
  ogType: "article" | "website"
) {
  const canonical = new URL(pathname, siteUrl).toString()

  expect(await page.title()).toBeTruthy()
  expect(
    await page.locator('meta[name="description"]').getAttribute("content")
  ).toBeTruthy()
  expect(
    await page.locator('meta[property="og:title"]').getAttribute("content")
  ).toBeTruthy()
  expect(
    await page
      .locator('meta[property="og:description"]')
      .getAttribute("content")
  ).toBeTruthy()
  expect(
    await page.locator('meta[property="og:type"]').getAttribute("content")
  ).toBe(ogType)
  expect(
    await page.locator('meta[property="og:url"]').getAttribute("content")
  ).toBe(canonical)
  expect(
    await page.locator('meta[property="og:locale"]').getAttribute("content")
  ).toBe(locale)
  expect(
    await page.locator('meta[property="og:image"]').getAttribute("content")
  ).toBeTruthy()
  expect(
    await page.locator('meta[name="twitter:title"]').getAttribute("content")
  ).toBeTruthy()
  expect(
    await page
      .locator('meta[name="twitter:description"]')
      .getAttribute("content")
  ).toBeTruthy()
  expect(
    await page.locator('meta[name="twitter:image"]').getAttribute("content")
  ).toBeTruthy()
  expect(await page.locator('link[rel="canonical"]').getAttribute("href")).toBe(
    canonical
  )
}

test.describe("SEO meta tags", () => {
  test("root redirects to localized home with SEO tags intact", async ({
    page,
  }) => {
    await page.goto("/")
    await page.waitForFunction(() => location.pathname === "/en")
    await expectSeoTags(page, "/en", "en", "website")
  })

  for (const locale of locales) {
    for (const pathname of ["", "/profile", "/blog", "/projects"] as const) {
      test(`/${locale}${pathname || ""} emits required SEO tags`, async ({
        page,
      }) => {
        const route = `/${locale}${pathname}`
        await page.goto(route)
        await expectSeoTags(page, route, locale, "website")
      })
    }

    const blogDir = join(process.cwd(), "src", "content", "blog", locale)
    for (const slug of collectMdxSlugs(blogDir)) {
      test(`/${locale}/blog/${slug} emits required SEO tags`, async ({
        page,
      }) => {
        const route = `/${locale}/blog/${slug}`
        await page.goto(route)
        await expectSeoTags(page, route, locale, "article")
      })
    }

    const projectsDir = join(
      process.cwd(),
      "src",
      "content",
      "projects",
      locale
    )
    for (const slug of collectMdxSlugs(projectsDir)) {
      test(`/${locale}/projects/${slug} emits required SEO tags`, async ({
        page,
      }) => {
        const route = `/${locale}/projects/${slug}`
        await page.goto(route)
        await expectSeoTags(page, route, locale, "website")
      })
    }
  }

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
