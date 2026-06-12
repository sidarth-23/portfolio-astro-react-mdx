import type {
  ProfileLocaleContent,
  ProfileSkillGroup,
  ProfileCertification,
} from "@/content/content.types"
import type { Locale } from "@/i18n/config"
import { stripMarkdownToText, normalizeWhitespace } from "@/lib/content/text"

import { slugify } from "./slugify"

export interface SearchBlogPostInput {
  slug: string
  title: string
  description: string
  tags: string[]
  category?: string
  body: string
}

export interface SearchExperienceRoleInput {
  id: string
  title: string
  location?: string
  details: string
}

export interface SearchExperienceInput {
  id: number
  company: string
  location: string
  roles: SearchExperienceRoleInput[]
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
}

export interface SearchResult {
  id: string
  title: string
  sectionTitle?: string
  url: string
  snippet: string
  kind: "page" | "section" | "item"
}

export interface SearchCorpusInput {
  locale: Locale
  blogPosts: SearchBlogPostInput[]
  profileTitle: string
  profile: ProfileLocaleContent
  experiences: SearchExperienceInput[]
}

function tokenize(value: string): string[] {
  return Array.from(
    new Set(
      normalize(value)
        .split(" ")
        .filter((token) => token.length > 0)
    )
  )
}

function normalize(value: string): string {
  return normalizeWhitespace(
    value
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
  )
}

function countOccurrences(haystack: string, needle: string): number {
  if (!needle) return 0

  let count = 0
  let index = 0

  while (index !== -1) {
    index = haystack.indexOf(needle, index)
    if (index !== -1) {
      count += 1
      index += needle.length
    }
  }

  return count
}

function createSnippet(content: string, query: string): string {
  const text = normalizeWhitespace(content)
  if (!text) return ""

  if (text.length <= 180) return text

  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase().trim()
  const index = lowerQuery ? lowerText.indexOf(lowerQuery) : -1

  if (index === -1) {
    return `${text.slice(0, 177).trim()}...`
  }

  const start = Math.max(0, index - 60)
  const end = Math.min(text.length, index + 120)
  return `${start > 0 ? "..." : ""}${text.slice(start, end).trim()}${
    end < text.length ? "..." : ""
  }`
}

function scoreDocument(doc: SearchDocument, query: string): number {
  const normalizedQuery = normalize(query)
  const tokens = tokenize(query)
  const searchable = normalize(
    [doc.title, doc.sectionTitle ?? "", doc.content, doc.tags.join(" ")].join(
      " "
    )
  )

  if (!normalizedQuery || tokens.length === 0) return 0
  if (!tokens.every((token) => searchable.includes(token))) return 0

  let score = doc.weight

  if (searchable.startsWith(normalizedQuery)) score += 25
  if (normalize(doc.title).includes(normalizedQuery)) score += 40
  if (doc.sectionTitle && normalize(doc.sectionTitle).includes(normalizedQuery))
    score += 20

  for (const token of tokens) {
    score += countOccurrences(searchable, token) * 4
    score += countOccurrences(normalize(doc.title), token) * 10
    score +=
      doc.sectionTitle && normalize(doc.sectionTitle).includes(token) ? 8 : 0
    score += countOccurrences(normalize(doc.tags.join(" ")), token) * 2
  }

  return score
}

function addDocument(docs: SearchDocument[], doc: SearchDocument): void {
  docs.push(doc)
}

function buildBlogSectionDocuments(
  locale: Locale,
  post: SearchBlogPostInput
): SearchDocument[] {
  const pageUrl = `/${locale}/blog/${post.slug}`
  const docs: SearchDocument[] = []

  addDocument(docs, {
    id: `blog-${post.slug}`,
    title: post.title,
    sectionTitle: "",
    url: pageUrl,
    content: stripMarkdownToText(
      [
        post.title,
        post.description,
        post.tags.join(" "),
        post.category ?? "",
        post.body,
      ].join("\n\n")
    ),
    kind: "page",
    weight: 100,
    tags: post.tags,
  })

  const lines = post.body.split(/\r?\n/)
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

  for (const section of sections) {
    addDocument(docs, {
      id: `blog-${post.slug}-${slugify(section.title)}`,
      title: post.title,
      sectionTitle: section.title,
      url: `${pageUrl}#${slugify(section.title)}`,
      content: section.content,
      kind: "section",
      weight: 80,
      tags: post.tags,
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
  profile: ProfileLocaleContent,
  experiences: SearchExperienceInput[]
): SearchDocument[] {
  const pageUrl = `/${locale}/profile`
  const docs: SearchDocument[] = []

  addDocument(docs, {
    id: "profile-overview",
    title: profileTitle,
    sectionTitle: "Overview",
    url: `${pageUrl}#overview`,
    content: stripMarkdownToText(
      [
        profile.profile.name,
        profile.profile.role,
        profile.profile.summary,
        profile.profile.focus.join(" "),
      ].join("\n\n")
    ),
    kind: "section",
    weight: 95,
    tags: [profile.profile.role],
  })

  addDocument(docs, {
    id: "profile-experience",
    title: profileTitle,
    sectionTitle: "Experience",
    url: `${pageUrl}#experience`,
    content: stripMarkdownToText(
      experiences
        .flatMap((experience) => [
          experience.company,
          experience.location,
          ...experience.roles.flatMap((role) => [
            role.title,
            role.location ?? "",
            role.details,
          ]),
        ])
        .join("\n\n")
    ),
    kind: "section",
    weight: 40,
    tags: [],
  })

  for (const experience of experiences) {
    for (const [roleIndex, role] of experience.roles.entries()) {
      addDocument(docs, {
        id: role.id,
        title: profileTitle,
        sectionTitle: `${experience.company} · ${role.title}`,
        url: `${pageUrl}#${role.id}`,
        content: stripMarkdownToText(
          [
            experience.company,
            experience.location,
            role.title,
            role.location ?? "",
            role.details,
          ].join("\n\n")
        ),
        kind: "item",
        weight: 85 - roleIndex,
        tags: [experience.company],
      })
    }
  }

  addDocument(docs, {
    id: "profile-skills",
    title: profileTitle,
    sectionTitle: "Technologies & Skills",
    url: `${pageUrl}#technologies-skills`,
    content: stripMarkdownToText(flattenProfileSkills(profile.skills)),
    kind: "section",
    weight: 90,
    tags: [],
  })

  for (const group of profile.skills) {
    addDocument(docs, {
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
    })
  }

  addDocument(docs, {
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
  })

  for (const cert of profile.certifications) {
    addDocument(docs, {
      id: `cert-${slugify(cert.title)}`,
      title: profileTitle,
      sectionTitle: cert.title,
      url: cert.url,
      content: stripMarkdownToText(cert.title),
      kind: "item",
      weight: 86,
      tags: [cert.title],
    })
  }

  return docs
}

export function buildSearchDocuments(
  input: SearchCorpusInput
): SearchDocument[] {
  const docs = [
    ...input.blogPosts.flatMap((post) =>
      buildBlogSectionDocuments(input.locale, post)
    ),
    ...buildProfileDocuments(
      input.locale,
      input.profileTitle,
      input.profile,
      input.experiences
    ),
  ]

  return docs
}

export function searchDocuments(
  docs: SearchDocument[],
  query: string,
  limit = 8
): SearchResult[] {
  const scored = docs
    .map((doc) => ({ ...doc, score: scoreDocument(doc, query) }))
    .filter((doc) => doc.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, limit)

  return scored.map((doc) => ({
    id: doc.id,
    title: doc.title,
    sectionTitle: doc.sectionTitle,
    url: doc.url,
    snippet: createSnippet(doc.content, query),
    kind: doc.kind,
  }))
}
