import { mkdir, readdir, readFile, rm, writeFile } from "fs/promises"
import path from "path"

import matter from "gray-matter"

import { pageSeo, profileContent } from "../src/content/content"
import { locales, type Locale } from "../src/i18n/config"
import { buildSearchExports } from "../src/lib/search/exports"

import type {
  SearchBlogPostInput,
  SearchCorpusInput,
  SearchExperienceInput,
} from "../src/lib/search/search"

const OUTPUT_DIR = path.resolve(process.cwd(), "src/generated")
const LEGACY_OUTPUT_FILE = path.join(OUTPUT_DIR, "search.json")
// A locale export at rest should stay well under 1 MB; a jump past this
// threshold means an indexing regression (e.g. tokenize "full" sneaking back).
const MAX_LOCALE_BYTES = 2 * 1024 * 1024

async function walkFiles(dir: string, extension: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        return walkFiles(fullPath, extension)
      }
      if (entry.isFile() && entry.name.endsWith(extension)) {
        return [fullPath]
      }
      return []
    })
  )

  return files.flat()
}

async function readBlogPosts(locale: Locale): Promise<SearchBlogPostInput[]> {
  const contentDir = path.resolve(process.cwd(), "src/content/blog", locale)
  const files = await walkFiles(contentDir, ".mdx")

  const posts = await Promise.all(
    files.map(async (file) => {
      const raw = await readFile(file, "utf-8")
      const { data, content } = matter(raw)

      if (data.draft) return null

      const post: SearchBlogPostInput = {
        slug: path.basename(file, ".mdx"),
        title: String(data.title ?? ""),
        description: String(data.description ?? ""),
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        body: content,
      }

      if (data.category) {
        post.category = String(data.category)
      }

      return post
    })
  )

  return posts.filter((post): post is SearchBlogPostInput => post !== null)
}

async function readExperiences(
  locale: Locale
): Promise<SearchExperienceInput[]> {
  const contentDir = path.resolve(
    process.cwd(),
    "src/content/profile-experience",
    locale
  )
  const files = await walkFiles(contentDir, ".md")

  const entries = await Promise.all(
    files.map(async (file) => {
      const raw = await readFile(file, "utf-8")
      const { data, content } = matter(raw)

      return {
        id: Number(data.id),
        company: String(data.company),
        location: String(data.companyLocation),
        role: {
          title: String(data.role?.title ?? ""),
          location: data.role?.location
            ? String(data.role.location)
            : undefined,
          details: content.trim(),
        },
      }
    })
  )

  const grouped = new Map<
    string,
    {
      id: number
      company: string
      location: string
      roles: SearchExperienceInput["roles"]
    }
  >()

  for (const entry of entries) {
    const key = `${locale}-${entry.id}-${entry.company}`
    const existing = grouped.get(key)

    if (existing) {
      existing.roles.push({
        id: `experience-${entry.id}-${existing.roles.length}`,
        title: entry.role.title,
        location: entry.role.location,
        details: entry.role.details,
      })
      continue
    }

    grouped.set(key, {
      id: entry.id,
      company: entry.company,
      location: entry.location,
      roles: [
        {
          id: `experience-${entry.id}-0`,
          title: entry.role.title,
          location: entry.role.location,
          details: entry.role.details,
        },
      ],
    })
  }

  return Array.from(grouped.values())
}

async function buildCorpus(): Promise<Record<Locale, SearchCorpusInput>> {
  const entries = await Promise.all(
    locales.map(async (locale) => {
      const [blogPosts, experiences] = await Promise.all([
        readBlogPosts(locale),
        readExperiences(locale),
      ])

      return [
        locale,
        {
          locale,
          blogPosts,
          profileTitle: pageSeo.profile[locale].title,
          profile: profileContent[locale],
          experiences,
        } satisfies SearchCorpusInput,
      ] as const
    })
  )

  const corpus = {} as Record<Locale, SearchCorpusInput>

  for (const [locale, input] of entries) {
    corpus[locale] = input
  }

  return corpus
}

function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / 1024).toFixed(1)} KB`
}

async function writeLocaleExport(
  locale: Locale,
  serialized: string
): Promise<"written" | "unchanged"> {
  const outputFile = path.join(OUTPUT_DIR, `search.${locale}.json`)

  const existing = await readFile(outputFile, "utf-8").catch(() => null)
  if (existing === serialized) return "unchanged"

  await writeFile(outputFile, serialized)
  return "written"
}

async function main() {
  const corpus = await buildCorpus()
  const exportsByLocale = buildSearchExports(corpus)

  await mkdir(OUTPUT_DIR, { recursive: true })
  await rm(LEGACY_OUTPUT_FILE, { force: true })

  for (const locale of locales) {
    const serialized = JSON.stringify(exportsByLocale[locale])
    const bytes = Buffer.byteLength(serialized)

    if (bytes > MAX_LOCALE_BYTES) {
      console.error(
        `[search-index] ${locale}: ${formatBytes(bytes)} exceeds the ` +
          `${formatBytes(MAX_LOCALE_BYTES)} limit — indexing regression?`
      )
      process.exit(1)
    }

    const outcome = await writeLocaleExport(locale, serialized)
    console.log(`[search-index] ${locale}: ${formatBytes(bytes)} (${outcome})`)
  }
}

await main()
