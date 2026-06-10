import { describe, expect, it } from "vitest"
import { existsSync, statSync } from "fs"
import path from "path"
import { getAllPageSeoEntries } from "./pages"

describe("OG image files", () => {
  const ogDir = path.resolve(process.cwd(), "public/og")

  it("has OG images for all page SEO entries", () => {
    const entries = getAllPageSeoEntries()

    for (const entry of entries) {
      const filename = `og-${entry.page}-${entry.locale}.png`
      const filepath = path.join(ogDir, filename)

      expect(
        existsSync(filepath),
        `Missing OG image: ${filename} for page "${entry.page}" locale "${entry.locale}"`
      ).toBe(true)
    }
  })

  it("has OG images for all core pages across all locales", () => {
    const corePages = ["home", "blog", "projects", "profile"]
    const locales = ["en", "es", "fr"]

    for (const page of corePages) {
      for (const locale of locales) {
        const filename = `og-${page}-${locale}.png`
        const filepath = path.join(ogDir, filename)

        expect(existsSync(filepath), `Missing OG image: ${filename}`).toBe(true)
      }
    }
  })

  it("OG image files are not empty", () => {
    const entries = getAllPageSeoEntries()

    for (const entry of entries) {
      const filename = `og-${entry.page}-${entry.locale}.png`
      const filepath = path.join(ogDir, filename)

      if (existsSync(filepath)) {
        const stats = statSync(filepath)
        expect(stats.size, `OG image ${filename} is empty`).toBeGreaterThan(0)
        expect(stats.size, `OG image ${filename} is too small`).toBeGreaterThan(
          1000
        )
      }
    }
  })
})
