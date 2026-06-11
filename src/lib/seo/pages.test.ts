import { describe, expect, it } from "vitest"

import { locales } from "@/i18n/config"

import { getPageSeo, getAllPageSeoEntries } from "./pages"

describe("getPageSeo", () => {
  it("returns SEO config for home page in English", () => {
    const result = getPageSeo("home", "en")
    expect(result.title).toBe("Home")
    expect(result.description).toBe(
      "Sid's portfolio — thoughts on engineering, design, and building things."
    )
  })

  it("returns translated SEO config for home page in Spanish", () => {
    const result = getPageSeo("home", "es")
    expect(result.title).toBe("Home")
    expect(result.description).toBe(
      "Portafolio de Sid — reflexiones sobre ingeniería, diseño y construcción de cosas."
    )
  })

  it("returns translated SEO config for home page in French", () => {
    const result = getPageSeo("home", "fr")
    expect(result.title).toBe("Home")
    expect(result.description).toBe(
      "Portfolio de Sid — réflexions sur l'ingénierie, le design, et la construction de choses."
    )
  })

  it("returns SEO config for blog page", () => {
    const result = getPageSeo("blog", "en")
    expect(result.title).toBe("Blog")
    expect(result.description).toBe(
      "Thoughts on engineering, design, and building things."
    )
  })

  it("returns SEO config for profile page", () => {
    const result = getPageSeo("profile", "en")
    expect(result.title).toBe("Profile")
    expect(result.description).toBe(
      "Professional bug writer and occasional feature shipper."
    )
  })

  it("throws error for non-existent page", () => {
    expect(() => getPageSeo("nonexistent", "en")).toThrow(
      "No SEO config found for page: nonexistent"
    )
  })

  it("throws error for non-existent locale", () => {
    expect(() => getPageSeo("home", "de")).toThrow(
      "No SEO config found for page home locale de"
    )
  })
})

describe("getAllPageSeoEntries", () => {
  it("returns all page SEO entries", () => {
    const entries = getAllPageSeoEntries()
    expect(entries.length).toBeGreaterThan(0)

    // Should have entries for all locales
    const homeEn = entries.find((e) => e.page === "home" && e.locale === "en")
    expect(homeEn).toBeDefined()
    expect(homeEn!.title).toBe("Home")
  })

  it("includes all core pages", () => {
    const entries = getAllPageSeoEntries()
    const pages = [...new Set(entries.map((e) => e.page))]

    expect(pages).toContain("home")
    expect(pages).toContain("blog")
    expect(pages).toContain("profile")
  })

  it("includes all supported locales for each page", () => {
    const entries = getAllPageSeoEntries()

    for (const page of ["home", "blog", "profile"]) {
      const pageLocales = entries
        .filter((e) => e.page === page)
        .map((e) => e.locale)

      for (const locale of locales) {
        expect(pageLocales).toContain(locale)
      }
    }
  })

  it("each entry has required fields", () => {
    const entries = getAllPageSeoEntries()

    for (const entry of entries) {
      expect(entry.page).toBeTruthy()
      expect(entry.locale).toBeTruthy()
      expect(entry.title).toBeTruthy()
      expect(entry.description).toBeTruthy()
      expect(entry.title.length).toBeLessThanOrEqual(60)
      expect(entry.description.length).toBeLessThanOrEqual(160)
    }
  })
})
