import { describe, expect, it } from "vitest"

import {
  buildSearchIndexExport,
  importSearchEngine,
  searchSearchEngine,
} from "./flexsearch"
import { buildSearchDocuments } from "./search"

import type { SearchCorpusInput } from "./search"

const corpus: SearchCorpusInput = {
  locale: "en",
  blogPosts: [
    {
      slug: "hello-world",
      title: "Hello World",
      description: "A post about deployment details",
      tags: ["astro", "deploy"],
      category: "Engineering",
      body: `## Intro

This is an introduction.

## Deployment

We watch metrics and logs during deployment.

## Closing

Thanks for reading.`,
    },
    {
      slug: "metricas-post",
      title: "Métricas avanzadas",
      description: "Observabilidad y métricas",
      tags: ["observability"],
      category: "Engineering",
      body: `## Métricas

Las métricas importan.`,
    },
  ],
  profileTitle: "Profile",
  profile: {
    name: "Sidarth G",
    role: "Software Developer",
    tagline: "I build web apps.",
    focus: ["Frontend", "Backend"],
    skills: [
      {
        title: "Frontend & DX",
        items: [
          { label: "Astro", icon: { source: "simple", name: "astro" } },
          { label: "React", icon: { source: "simple", name: "react" } },
        ],
      },
    ],
    certifications: [{ title: "Learn Go", url: "https://example.com/cert" }],
  },
  profileSections: [
    {
      title: "Now, at Truvanta",
      content: "Built deployment tooling and observability dashboards.",
    },
  ],
}

const docs = buildSearchDocuments(corpus)

function createEngine() {
  return importSearchEngine(buildSearchIndexExport(docs))
}

describe("flexsearch engine", () => {
  it("round-trips export and import", async () => {
    const payload = buildSearchIndexExport(docs)

    expect(payload.docs).toHaveLength(docs.length)
    expect(Object.keys(payload.index).length).toBeGreaterThan(0)

    const engine = importSearchEngine(payload)
    const results = await searchSearchEngine(engine, "deployment")

    expect(results[0]).toMatchObject({
      url: "/en/blog/hello-world#deployment",
      kind: "section",
      scope: "blog",
    })
  })

  it("returns profile section hits for skill queries", async () => {
    const results = await searchSearchEngine(createEngine(), "frontend dx")

    expect(results[0]).toMatchObject({
      url: "/en/profile#skills-frontend-dx",
      kind: "item",
      scope: "profile",
    })
  })

  it("matches diacritics both ways", async () => {
    const engine = createEngine()

    const accented = await searchSearchEngine(engine, "métricas")
    const plain = await searchSearchEngine(engine, "metricas")

    expect(accented.length).toBeGreaterThan(0)
    expect(plain.length).toBeGreaterThan(0)
    expect(accented[0].url).toBe(plain[0].url)
  })

  it("ranks title matches above body-only matches", async () => {
    const results = await searchSearchEngine(createEngine(), "hello world")

    expect(results[0]).toMatchObject({
      id: "blog-hello-world",
      kind: "page",
    })
  })

  it("filters results by scope", async () => {
    const engine = createEngine()

    // "deployment" appears in blog content and a profile narrative section
    const all = await searchSearchEngine(engine, "deployment")
    const blogOnly = await searchSearchEngine(engine, "deployment", {
      scope: "blog",
    })

    expect(all.some((result) => result.scope === "profile")).toBe(true)
    expect(blogOnly.length).toBeGreaterThan(0)
    expect(blogOnly.every((result) => result.scope === "blog")).toBe(true)
  })

  it("returns match ranges for highlighting", async () => {
    const results = await searchSearchEngine(createEngine(), "deployment")
    const section = results.find(
      (result) => result.url === "/en/blog/hello-world#deployment"
    )

    expect(section).toBeDefined()
    expect(section!.snippetMatches.length).toBeGreaterThan(0)
    expect(section!.sectionTitleMatches.length).toBeGreaterThan(0)

    const [range] = section!.sectionTitleMatches
    expect(
      section!.sectionTitle!.slice(range.start, range.end).toLowerCase()
    ).toBe("deployment")
  })

  it("respects the result limit", async () => {
    const results = await searchSearchEngine(createEngine(), "the", {
      limit: 2,
    })

    expect(results.length).toBeLessThanOrEqual(2)
  })
})
