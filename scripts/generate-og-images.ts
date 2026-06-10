import { existsSync, mkdirSync } from "fs"
import { readdir, readFile, writeFile } from "fs/promises"
import path from "path"
import matter from "gray-matter"
import { pageSeo } from "../src/content/content"
import { renderOgImage } from "../src/lib/seo/generate-image"
import { buildContentOgFilename } from "../src/lib/seo/content-og"

const OUTPUT_DIR = path.resolve(process.cwd(), "public/og")

type ContentType = "blog" | "projects"

function ensureOutputDir() {
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true })
  }
}

async function walkMdxFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) return walkMdxFiles(fullPath)
      if (entry.isFile() && fullPath.endsWith(".mdx")) return [fullPath]
      return [] as string[]
    })
  )

  return files.flat()
}

function toDataUrl(imageBuffer: Buffer, extension: string): string {
  const ext = extension.toLowerCase()
  const mime =
    ext === ".jpg" || ext === ".jpeg"
      ? "image/jpeg"
      : ext === ".webp"
        ? "image/webp"
        : ext === ".gif"
          ? "image/gif"
          : "image/png"

  return `data:${mime};base64,${imageBuffer.toString("base64")}`
}

async function generateContentOgImages(type: ContentType) {
  const baseDir = path.resolve(process.cwd(), `src/content/${type}`)
  const files = await walkMdxFiles(baseDir)

  for (const filePath of files) {
    try {
      const fileRaw = await readFile(filePath, "utf-8")
      const parsed = matter(fileRaw)
      const frontmatter = parsed.data as {
        locale?: string
        seo?: { title?: string; description?: string }
        title?: string
        description?: string
        summary?: string
        coverImage?: string
      }

      const locale = frontmatter.locale
      if (!locale) continue

      const relativeFromType = path.relative(baseDir, filePath)
      const slug = relativeFromType
        .replace(/\\/g, "/")
        .replace(/\.mdx$/, "")
        .split("/")
        .slice(1)
        .join("/")
      if (!slug) continue

      const title = frontmatter.seo?.title ?? frontmatter.title
      const description =
        frontmatter.seo?.description ??
        frontmatter.description ??
        frontmatter.summary
      const coverImageRaw = frontmatter.coverImage

      if (!title || !description || !coverImageRaw) continue

      const coverImagePath = path.resolve(path.dirname(filePath), coverImageRaw)
      const coverBuffer = await readFile(coverImagePath)
      const coverImageDataUrl = toDataUrl(
        coverBuffer,
        path.extname(coverImagePath)
      )

      const buffer = await renderOgImage({
        title,
        description,
        coverImageDataUrl,
      })

      const filename = buildContentOgFilename(type, locale, slug)
      const outputPath = path.join(OUTPUT_DIR, filename)
      await writeFile(outputPath, buffer)
      console.log(`Generated: ${filename}`)
    } catch (error) {
      console.error(
        `Failed to generate OG image for content file ${filePath}:`,
        error
      )
    }
  }
}

async function generatePageOgImages() {
  const config = pageSeo

  console.log(
    `Generating OG images for ${Object.keys(config).length} page types`
  )

  for (const [pageName, byLocale] of Object.entries(config)) {
    for (const [locale, { title, description }] of Object.entries(byLocale)) {
      try {
        const buffer = await renderOgImage({ title, description })
        const filename = `og-${pageName}-${locale}.png`
        const outputPath = path.join(OUTPUT_DIR, filename)
        await writeFile(outputPath, buffer)
        console.log(`Generated: ${filename}`)
      } catch (error) {
        console.error(
          `Failed to generate OG image for ${pageName}-${locale}:`,
          error
        )
      }
    }
  }
}

async function main() {
  ensureOutputDir()
  await generatePageOgImages()
  await generateContentOgImages("blog")
  await generateContentOgImages("projects")
  console.log("OG image generation complete!")
}

main().catch((error) => {
  console.error("OG image generation failed:", error)
  process.exit(1)
})
