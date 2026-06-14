import { describe, expect, it, vi } from "vitest"

import { buildSearchIndexExport, importSearchEngine } from "./flexsearch"
import { searchBlogSlugs } from "./listing-search"
import { buildSearchDocuments } from "./search"

import type { SearchCorpusInput } from "./search"

const corpus: SearchCorpusInput = {
  locale: "en",
  blogPosts: [
    {
      slug: "deploy-guide",
      title: "Deploy Guide",
      description: "All about deployment",
      tags: ["deploy"],
      body: `## Setup

Setting things up.

## Deployment

Deployment steps in detail.`,
    },
    {
      slug: "other-post",
      title: "Other Post",
      description: "Mentions deployment once",
      tags: [],
      body: `## Notes

A note about deployment.`,
    },
  ],
  profileTitle: "Profile",
  profile: {
    name: "Sidarth G",
    role: "Software Developer",
    tagline: "Deployment specialist.",
    focus: ["Backend"],
    skills: [],
    certifications: [],
  },
  profileSections: [],
}

vi.mock("./server", () => ({
  getSearchEngine: vi.fn(async () =>
    importSearchEngine(buildSearchIndexExport(buildSearchDocuments(corpus)))
  ),
}))

describe("searchBlogSlugs", () => {
  it("collapses page and section hits into unique slugs", async () => {
    const slugs = await searchBlogSlugs("en", "deployment")

    expect(new Set(slugs).size).toBe(slugs.length)
    expect(slugs).toContain("deploy-guide")
    expect(slugs).toContain("other-post")
  })

  it("excludes profile documents", async () => {
    // "specialist" only appears in the profile tagline
    const slugs = await searchBlogSlugs("en", "specialist")

    expect(slugs).toEqual([])
  })

  it("returns the strongest match first", async () => {
    const slugs = await searchBlogSlugs("en", "deploy guide")

    expect(slugs[0]).toBe("deploy-guide")
  })
})
