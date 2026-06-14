import type {
  ProfileSkillGroup,
  ProfileCertification,
} from "@/content/content.types"
import type { Locale } from "@/i18n/config"
import { stripMarkdownToText } from "@/lib/content/text"

import { slugify } from "./slugify"

import type { MatchRange } from "./snippet"

export type SearchScope = "blog" | "profile"

export interface SearchBlogPostInput {
  slug: string
  title: string
  description: string
  tags: string[]
  category?: string
  body: string
}

export interface SearchProfileInput {
  name: string
  role: string
  tagline: string
  focus: string[]
  skills: ProfileSkillGroup[]
  certifications: ProfileCertification[]
}

export interface SearchProfileSection {
  title: string
  content: string
}

export interface SearchDocument {
  id: string
  title: string
  sectionTitle?: string
  url: string
  content: string
  kind: "page" | "section" | "item"
  weight: number
  tags: string[]
  scope: SearchScope
  slug: string | null
}

export interface SearchResult {
  id: string
  title: string
  sectionTitle?: string
  url: string
  kind: "page" | "section" | "item"
  scope: SearchScope
  snippet: string
  snippetMatches: MatchRange[]
  titleMatches: MatchRange[]
  sectionTitleMatches: MatchRange[]
}

export interface SearchCorpusInput {
  locale: Locale
  blogPosts: SearchBlogPostInput[]
  profileTitle: string
  profile: SearchProfileInput
  profileSections: SearchProfileSection[]
}

// Split a markdown/MDX body into heading-delimited sections, returning the
// stripped plain-text content per section. Content before the first heading is
// ignored. Used for both blog bodies and the profile narrative.
export function splitMarkdownSections(
  body: string
): Array<{ title: string; content: string }> {
  const lines = body.split(/\r?\n/)
  let currentHeading = ""
  let currentLines: string[] = []
  let inCodeFence = false
  const sections: Array<{ title: string; content: string }> = []

  const flushSection = () => {
    if (!currentHeading) return
    const content = stripMarkdownToText(currentLines.join("\n"))
    if (content.length === 0) return
    sections.push({ title: currentHeading, content })
  }

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      inCodeFence = !inCodeFence
      if (currentHeading) currentLines.push(line)
      continue
    }

    if (!inCodeFence) {
      const headingMatch = line.match(/^(#{1,6})\s+(.*)$/)
      if (headingMatch) {
        flushSection()
        currentHeading = stripMarkdownToText(headingMatch[2])
        currentLines = []
        continue
      }
    }

    if (currentHeading) currentLines.push(line)
  }

  flushSection()

  return sections
}

function buildBlogSectionDocuments(
  locale: Locale,
  post: SearchBlogPostInput
): SearchDocument[] {
  const pageUrl = `/${locale}/blog/${post.slug}`
  const docs: SearchDocument[] = []

  docs.push({
    id: `blog-${post.slug}`,
    title: post.title,
    sectionTitle: "",
    url: pageUrl,
    content: stripMarkdownToText(
      [post.description, post.tags.join(" "), post.category ?? ""].join("\n\n")
    ),
    kind: "page",
    weight: 100,
    tags: post.tags,
    scope: "blog",
    slug: post.slug,
  })

  const sections = splitMarkdownSections(post.body)

  for (const section of sections) {
    docs.push({
      id: `blog-${post.slug}-${slugify(section.title)}`,
      title: post.title,
      sectionTitle: section.title,
      url: `${pageUrl}#${slugify(section.title)}`,
      content: section.content,
      kind: "section",
      weight: 80,
      tags: post.tags,
      scope: "blog",
      slug: post.slug,
    })
  }

  return docs
}

function flattenProfileSkills(groups: readonly ProfileSkillGroup[]): string {
  return groups
    .flatMap((group) => [group.title, ...group.items.map((item) => item.label)])
    .join(" ")
}

function flattenProfileCertifications(
  certs: readonly ProfileCertification[]
): string {
  return certs.map((cert) => cert.title).join(" ")
}

function buildProfileDocuments(
  locale: Locale,
  profileTitle: string,
  profile: SearchProfileInput,
  profileSections: SearchProfileSection[]
): SearchDocument[] {
  const pageUrl = `/${locale}/profile`
  const docs: SearchDocument[] = []

  docs.push({
    id: "profile-overview",
    title: profileTitle,
    sectionTitle: "Overview",
    url: `${pageUrl}#overview`,
    content: stripMarkdownToText(
      [
        profile.name,
        profile.role,
        profile.tagline,
        profile.focus.join(" "),
      ].join("\n\n")
    ),
    kind: "section",
    weight: 95,
    tags: [profile.role],
    scope: "profile",
    slug: null,
  })

  for (const [index, section] of profileSections.entries()) {
    docs.push({
      id: `profile-${slugify(section.title)}`,
      title: profileTitle,
      sectionTitle: section.title,
      url: `${pageUrl}#${slugify(section.title)}`,
      content: section.content,
      kind: "section",
      weight: 84 - index,
      tags: [],
      scope: "profile",
      slug: null,
    })
  }

  docs.push({
    id: "profile-skills",
    title: profileTitle,
    sectionTitle: "Technologies & Skills",
    url: `${pageUrl}#technologies-skills`,
    content: stripMarkdownToText(flattenProfileSkills(profile.skills)),
    kind: "section",
    weight: 90,
    tags: [],
    scope: "profile",
    slug: null,
  })

  for (const group of profile.skills) {
    docs.push({
      id: `skills-${slugify(group.title)}`,
      title: profileTitle,
      sectionTitle: group.title,
      url: `${pageUrl}#skills-${slugify(group.title)}`,
      content: stripMarkdownToText(
        [group.title, ...group.items.map((item) => item.label)].join("\n\n")
      ),
      kind: "item",
      weight: 88,
      tags: group.items.map((item) => item.label),
      scope: "profile",
      slug: null,
    })
  }

  docs.push({
    id: "profile-certifications",
    title: profileTitle,
    sectionTitle: "Certifications",
    url: `${pageUrl}#certifications`,
    content: stripMarkdownToText(
      flattenProfileCertifications(profile.certifications)
    ),
    kind: "section",
    weight: 88,
    tags: [],
    scope: "profile",
    slug: null,
  })

  for (const cert of profile.certifications) {
    docs.push({
      id: `cert-${slugify(cert.title)}`,
      title: profileTitle,
      sectionTitle: cert.title,
      url: cert.url,
      content: stripMarkdownToText(cert.title),
      kind: "item",
      weight: 86,
      tags: [cert.title],
      scope: "profile",
      slug: null,
    })
  }

  return docs
}

export function buildSearchDocuments(
  input: SearchCorpusInput
): SearchDocument[] {
  return [
    ...input.blogPosts.flatMap((post) =>
      buildBlogSectionDocuments(input.locale, post)
    ),
    ...buildProfileDocuments(
      input.locale,
      input.profileTitle,
      input.profile,
      input.profileSections
    ),
  ]
}
