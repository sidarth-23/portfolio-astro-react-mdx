import { describe, expect, it } from "vitest"
import { getGlobalLink, homeCtaLinkIds } from "./global-links.data"

describe("globalLinks", () => {
  it("resolves home cta links from global config", () => {
    const primary = getGlobalLink(homeCtaLinkIds.primary)
    const secondary = getGlobalLink(homeCtaLinkIds.secondary)

    expect(primary.href("en")).toBe("https://linkedin.com/in/sidarth-g")
    expect(secondary.href("en")).toBe("/resume")
  })

  it("resolves locale-aware rss link", () => {
    const rss = getGlobalLink("rss")
    expect(rss.href("fr")).toBe("/fr/rss.xml")
  })
})
