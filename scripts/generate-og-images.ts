import { existsSync, mkdirSync } from "fs"
import { readdir, readFile, writeFile } from "fs/promises"
import path from "path"

import matter from "gray-matter"

import { pageSeo } from "../src/content/content"
import { buildContentOgFilename } from "../src/lib/seo/content-og"
import { renderOgImage, siteUrlToLabel } from "../src/lib/seo/generate-image"

const OUTPUT_DIR = path.resolve(process.cwd(), "public/og")

const siteUrl = process.env.SITE_URL
if (!siteUrl)
  throw new Error(
    "SITE_URL is required. Set it in .env or the process environment."
  )
const siteLabel = siteUrlToLabel(siteUrl)

type ContentType = "blog"

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
      if (entry.isDirectory()) {
        return walkMdxFiles(fullPath)
      }
      if (entry.isFile() && entry.name.endsWith(".mdx")) {
        return [fullPath]
      }
      return []
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
  const contentDir = path.resolve(process.cwd(), `src/content/${type}`)
  const files = await walkMdxFiles(contentDir)

  for (const file of files) {
    const raw = await readFile(file, "utf-8")
    const { data } = matter(raw)
    const locale: string = data.locale || "en"
    const slug = path.basename(file, ".mdx")
    const filename = buildContentOgFilename(type, locale, slug)
    const outPath = path.join(OUTPUT_DIR, filename)

    const coverImagePath = data.coverImage
      ? path.resolve(
          process.cwd(),
          "public",
          data.coverImage.replace(/^\//, "")
        )
      : undefined

    let coverDataUrl: string | undefined
    if (coverImagePath && existsSync(coverImagePath)) {
      const imageBuffer = await readFile(coverImagePath)
      const ext = path.extname(coverImagePath)
      coverDataUrl = toDataUrl(imageBuffer, ext)
    }

    const title: string = data.title || "Untitled"
    const description: string = data.description || ""

    const pngBuffer = await renderOgImage({
      title,
      description,
      coverImageDataUrl: coverDataUrl,
      siteLabel,
    })

    await writeFile(outPath, pngBuffer)
    console.log(`Generated OG image: ${outPath}`)
  }
}

async function generatePageOgImages() {
  for (const [pageName, byLocale] of Object.entries(pageSeo)) {
    for (const [locale, { title, description }] of Object.entries(byLocale)) {
      const filename = `og-${pageName}-${locale}.png`
      const outPath = path.join(OUTPUT_DIR, filename)

      const pngBuffer = await renderOgImage({
        title,
        description,
        siteLabel,
      })

      await writeFile(outPath, pngBuffer)
      console.log(`Generated OG image: ${outPath}`)
    }
  }
}

async function main() {
  ensureOutputDir()
  await generatePageOgImages()
  await generateContentOgImages("blog")
}

main().catch((error) => {
  console.error("OG image generation failed:", error)
  process.exit(1)
})
