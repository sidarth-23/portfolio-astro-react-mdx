import { describe, expect, it } from "vitest"

import { locales } from "@/i18n/config"

import { getPageSeo, getAllPageSeoEntries } from "./pages"

describe("getPageSeo", () => {
  it("returns SEO config for home page in English", () => {
    const result = getPageSeo("home", "en")
    expect(result.title).toBe(
      "Sidarth G | Software Developer Portfolio, Blog & Projects"
    )
    expect(result.description).toBe(
      "Explore Sidarth G's portfolio, blog, projects, and experiments across software engineering, product thinking, and the occasional side quest."
    )
  })

  it("returns translated SEO config for home page in Spanish", () => {
    const result = getPageSeo("home", "es")
    expect(result.title).toBe(
      "Sidarth G | Portafolio de desarrollo, blog y proyectos"
    )
    expect(result.description).toBe(
      "Explora el portafolio, blog, proyectos y experimentos de Sidarth G sobre ingeniería de software, producto y alguna que otra aventura extra."
    )
  })

  it("returns translated SEO config for home page in French", () => {
    const result = getPageSeo("home", "fr")
    expect(result.title).toBe(
      "Sidarth G | Portfolio développeur, blog et projets"
    )
    expect(result.description).toBe(
      "Découvrez le portfolio, le blog, les projets et les expériences de Sidarth G autour du développement, du produit et de quelques détours."
    )
  })

  it("returns SEO config for blog page", () => {
    const result = getPageSeo("blog", "en")
    expect(result.title).toBe("Engineering blog, notes, and project deep dives")
    expect(result.description).toBe(
      "Read concise notes and deeper posts on software engineering, shipping products, and working with React, Astro, Go, and modern tooling."
    )
  })

  it("returns SEO config for profile page", () => {
    const result = getPageSeo("profile", "en")
    expect(result.title).toBe("Profile, skills, experience, and certifications")
    expect(result.description).toBe(
      "See Sidarth G's profile, skills, experience, certifications, and a compact summary of how he builds software and keeps learning."
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
    expect(homeEn!.title).toBe(
      "Sidarth G | Software Developer Portfolio, Blog & Projects"
    )
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
