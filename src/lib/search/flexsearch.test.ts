import { describe, expect, it } from "vitest"

import {
  buildSearchIndexExport,
  importSearchIndex,
  searchFlexSearchIndex,
} from "./flexsearch"
import { buildSearchDocuments } from "./search"

describe("flexsearch index", () => {
  const docs = buildSearchDocuments({
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
    ],
    profileTitle: "Profile",
    profile: {
      locale: "en",
      profile: {
        name: "Sidarth G",
        role: "Software Developer",
        summary: "I build web apps.",
        focus: ["Frontend", "Backend"],
      },
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
    experiences: [
      {
        id: 1,
        company: "Truvanta",
        location: "Remote",
        roles: [
          {
            id: "experience-1-0",
            title: "Full Stack Developer",
            location: "Remote",
            details: "Built deployment tooling and observability dashboards.",
          },
        ],
      },
    ],
  })

  it("exports and imports the corpus", async () => {
    const exported = buildSearchIndexExport(docs)
    const index = importSearchIndex(exported)
    const results = await searchFlexSearchIndex(index, "deployment")

    expect(results[0]).toMatchObject({
      url: "/en/blog/hello-world#deployment",
      kind: "section",
    })
  })

  it("returns profile section hits for skill queries", async () => {
    const exported = buildSearchIndexExport(docs)
    const index = importSearchIndex(exported)
    const results = await searchFlexSearchIndex(index, "frontend dx")

    expect(results[0]).toMatchObject({
      url: "/en/profile#skills-frontend-dx",
      kind: "item",
    })
  })
})
