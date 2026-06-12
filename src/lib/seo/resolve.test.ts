import { describe, expect, it } from "vitest"

import { resolveContentSeo, resolvePageSeo } from "./resolve"

import type { ContentEntry } from "./resolve"

describe("resolveContentSeo", () => {
  const mockSiteUrl = "https://sidshub.in"

  it("resolves blog entry SEO with cover image", () => {
    const mockEntry = {
      id: "en/my-blog-post",
      data: {
        seo: {
          title: "My Blog Post",
          description: "A description of my blog post.",
        },
        title: "My Blog Post Title",
        description: "A description of my blog post.",
        date: new Date("2024-01-15"),
        coverImage: {
          src: "/images/blog/post.jpg",
        } as unknown as import("astro").ImageMetadata,
      },
      collection: "blog" as const,
    } as unknown as ContentEntry

    const result = resolveContentSeo(mockEntry, "blog", "en", mockSiteUrl)

    expect(result.title).toBe("My Blog Post | Sidarth G")
    expect(result.description).toBe("A description of my blog post.")
    expect(result.ogImage).toBe(
      "https://sidshub.in/og/og-blog-en-my-blog-post.png"
    )
    expect(result.ogType).toBe("article")
    expect(result.ogLocale).toBe("en")
    expect(result.canonicalUrl).toBe("https://sidshub.in/en/blog/my-blog-post")
    expect(result.publishedTime).toBe("2024-01-15T00:00:00.000Z")
    expect(result.twitterCard).toBe("summary_large_image")
  })

  it("resolves blog entry SEO with updatedDate", () => {
    const mockEntry = {
      id: "en/my-project-writeup",
      data: {
        seo: {
          title: "My Project Write-up",
          description: "A description of my project write-up.",
        },
        title: "My Project Write-up Title",
        description: "A description of my project write-up.",
        date: new Date("2024-02-20"),
        updatedDate: new Date("2024-03-01"),
        coverImage: {
          src: "/images/blog/project.png",
        } as unknown as import("astro").ImageMetadata,
      },
      collection: "blog" as const,
    } as unknown as ContentEntry

    const result = resolveContentSeo(mockEntry, "blog", "en", mockSiteUrl)

    expect(result.title).toBe("My Project Write-up | Sidarth G")
    expect(result.description).toBe("A description of my project write-up.")
    expect(result.ogImage).toBe(
      "https://sidshub.in/og/og-blog-en-my-project-writeup.png"
    )
    expect(result.ogType).toBe("article")
    expect(result.publishedTime).toBe("2024-02-20T00:00:00.000Z")
    expect(result.modifiedTime).toBe("2024-03-01T00:00:00.000Z")
  })

  it("handles entries without updatedDate", () => {
    const mockEntry = {
      id: "en/blog-post",
      data: {
        seo: {
          title: "Blog Post",
          description: "Description.",
        },
        title: "Blog Post Title",
        description: "Description.",
        date: new Date("2024-01-01"),
        coverImage: {
          src: "/cover.jpg",
        } as unknown as import("astro").ImageMetadata,
      },
      collection: "blog" as const,
    } as unknown as ContentEntry

    const result = resolveContentSeo(mockEntry, "blog", "es", mockSiteUrl)

    expect(result.modifiedTime).toBeUndefined()
    expect(result.canonicalUrl).toBe("https://sidshub.in/es/blog/blog-post")
  })

  it("handles complex slug paths", () => {
    const mockEntry = {
      id: "fr/deep/nested/path",
      data: {
        seo: {
          title: "Deep Post",
          description: "Deep description.",
        },
        title: "Deep Post Title",
        description: "Deep description.",
        date: new Date("2024-01-01"),
        coverImage: {
          src: "/deep.jpg",
        } as unknown as import("astro").ImageMetadata,
      },
      collection: "blog" as const,
    } as unknown as ContentEntry

    const result = resolveContentSeo(mockEntry, "blog", "fr", mockSiteUrl)

    expect(result.canonicalUrl).toBe(
      "https://sidshub.in/fr/blog/deep/nested/path"
    )
  })
})

describe("resolvePageSeo", () => {
  const mockSiteUrl = "https://sidshub.in"

  it("resolves listing page SEO", () => {
    const result = resolvePageSeo(
      "Engineering blog, notes, and project deep dives",
      "Thoughts on engineering.",
      "https://sidshub.in/og/og-blog-en.png",
      "website",
      "en",
      mockSiteUrl,
      "/en/blog"
    )

    expect(result.title).toBe(
      "Engineering blog, notes, and project deep dives | Sidarth G"
    )
    expect(result.description).toBe("Thoughts on engineering.")
    expect(result.ogImage).toBe("https://sidshub.in/og/og-blog-en.png")
    expect(result.ogType).toBe("website")
    expect(result.ogLocale).toBe("en")
    expect(result.canonicalUrl).toBe("https://sidshub.in/en/blog")
    expect(result.twitterCard).toBe("summary_large_image")
  })

  it("resolves page SEO for different locales", () => {
    const esResult = resolvePageSeo(
      "Engineering blog, notes, and project deep dives",
      "Reflexiones sobre ingeniería.",
      "https://sidshub.in/og/og-blog-es.png",
      "website",
      "es",
      mockSiteUrl,
      "/es/blog"
    )

    expect(esResult.title).toBe(
      "Engineering blog, notes, and project deep dives | Sidarth G"
    )
    expect(esResult.ogLocale).toBe("es")
    expect(esResult.canonicalUrl).toBe("https://sidshub.in/es/blog")
  })

  it("handles home page path", () => {
    const result = resolvePageSeo(
      "Sidarth G | Software Developer Portfolio, Blog & Projects",
      "Portfolio description.",
      "https://sidshub.in/og/og-home-en.png",
      "website",
      "en",
      mockSiteUrl,
      "/en"
    )

    expect(result.canonicalUrl).toBe("https://sidshub.in/en")
  })

  it("can skip site suffix in title", () => {
    const result = resolvePageSeo(
      "Home",
      "Portfolio description.",
      "https://sidshub.in/og/og-home-en.png",
      "website",
      "en",
      mockSiteUrl,
      "/en",
      false
    )

    expect(result.title).toBe("Home")
  })

  it("handles profile page path", () => {
    const result = resolvePageSeo(
      "Profile, skills, experience, and certifications",
      "Profile description.",
      "https://sidshub.in/og/og-profile-en.png",
      "website",
      "en",
      mockSiteUrl,
      "/en/profile"
    )

    expect(result.canonicalUrl).toBe("https://sidshub.in/en/profile")
  })

  it("normalizes trailing slash in site URL and OG image path", () => {
    const result = resolvePageSeo(
      "Engineering blog, notes, and project deep dives",
      "Thoughts on engineering.",
      "https://sidshub.in//og/og-blog-en.png",
      "website",
      "en",
      "https://sidshub.in/",
      "/en/blog"
    )

    expect(result.ogImage).toBe("https://sidshub.in/og/og-blog-en.png")
    expect(result.canonicalUrl).toBe("https://sidshub.in/en/blog")
  })
})
