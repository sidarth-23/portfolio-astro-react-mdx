import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, "..")

const SIZES = [400, 600, 1200] as const
const OUTPUT_DIR = path.join(rootDir, "public", "_optimized")
const MANIFEST_PATH = path.join(rootDir, "src", "generated", "image-manifest.json")

interface ImageManifest {
  [originalPath: string]: {
    "400": string
    "600": string
    "1200": string
  }
}

interface MdxFrontmatter {
  coverImage?: string
}

async function parseMdxFrontmatter(filePath: string): Promise<MdxFrontmatter> {
  const content = await fs.readFile(filePath, "utf-8")
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return {}

  const frontmatter = match[1]
  const coverImageMatch = frontmatter.match(/coverImage:\s*"([^"]+)"|coverImage:\s*'([^']+)'/)

  return {
    coverImage: coverImageMatch?.[1] || coverImageMatch?.[2],
  }
}

function resolveImagePath(mdxPath: string, coverImage: string): string {
  if (coverImage.startsWith("/")) {
    return path.join(rootDir, coverImage)
  }
  return path.resolve(path.dirname(mdxPath), coverImage)
}

function getRelativePath(absolutePath: string): string {
  return path.relative(rootDir, absolutePath)
}

function slugifyPath(originalPath: string): string {
  return originalPath
    .replace(/[^a-zA-Z0-9]/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase()
    .replace(/^-|-$/g, "")
}

async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true })
}

async function optimizeImage(
  inputPath: string,
  outputDir: string,
  baseName: string
): Promise<{ "400": string; "600": string; "1200": string }> {
  await ensureDir(outputDir)
  const results: Partial<{ "400": string; "600": string; "1200": string }> = {}

  for (const size of SIZES) {
    const outputFileName = `${baseName}-${size}.webp`
    const outputPath = path.join(outputDir, outputFileName)
    const publicUrl = `/_optimized/${path.relative(path.join(rootDir, "public", "_optimized"), outputPath).replace(/\\/g, "/")}`

    const metadata = await sharp(inputPath).metadata()
    const isLandscape = (metadata.width || 0) > (metadata.height || 0)
    const targetDimension = isLandscape ? { width: size } : { height: Math.round(size * 0.625) }

    await sharp(inputPath)
      .resize(targetDimension.width, targetDimension.height, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toFile(outputPath)

    results[size.toString() as keyof typeof results] = publicUrl
  }

  return results as { "400": string; "600": string; "1200": string }
}

async function loadExistingManifest(): Promise<ImageManifest> {
  try {
    const content = await fs.readFile(MANIFEST_PATH, "utf-8")
    return JSON.parse(content)
  } catch {
    return {}
  }
}

async function scanContentDirectory(contentDir: string): Promise<Map<string, string[]>> {
  const images = new Map<string, string[]>()

  async function scanDir(dir: string): Promise<void> {
    const entries = await fs.readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        await scanDir(fullPath)
      } else if (entry.name.endsWith(".mdx")) {
        const frontmatter = await parseMdxFrontmatter(fullPath)
        if (frontmatter.coverImage) {
          const resolvedPath = resolveImagePath(fullPath, frontmatter.coverImage)
          const relativePath = getRelativePath(resolvedPath)

          if (!images.has(relativePath)) {
            images.set(relativePath, [])
          }
          images.get(relativePath)!.push(getRelativePath(fullPath))
        }
      }
    }
  }

  await scanDir(contentDir)
  return images
}

async function cleanupOldOptimizedImages(
  currentManifest: ImageManifest,
  newManifest: ImageManifest
): Promise<void> {
  const currentPaths = new Set(Object.values(currentManifest).flatMap((obj) => Object.values(obj)))
  const newPaths = new Set(Object.values(newManifest).flatMap((obj) => Object.values(obj)))

  for (const imagePath of currentPaths) {
    if (!newPaths.has(imagePath)) {
      const absolutePath = path.join(rootDir, "public", imagePath)
      try {
        await fs.unlink(absolutePath)
        console.log(`Removed stale image: ${imagePath}`)
      } catch {
        // File might not exist, ignore
      }
    }
  }

  // Clean up empty directories
  async function cleanEmptyDirs(dir: string): Promise<void> {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true })
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)
        if (entry.isDirectory()) {
          await cleanEmptyDirs(fullPath)
        }
      }

      const remaining = await fs.readdir(dir)
      if (remaining.length === 0 && dir !== OUTPUT_DIR) {
        await fs.rmdir(dir)
      }
    } catch {
      // Directory might not exist, ignore
    }
  }

  await cleanEmptyDirs(OUTPUT_DIR)
}

async function main(): Promise<void> {
  console.log("Optimizing listing images...")

  const startTime = Date.now()
  const existingManifest = await loadExistingManifest()
  const manifest: ImageManifest = {}

  await ensureDir(OUTPUT_DIR)
  await ensureDir(path.dirname(MANIFEST_PATH))

  const blogImages = await scanContentDirectory(path.join(rootDir, "src", "content", "blog"))
  const projectImages = await scanContentDirectory(path.join(rootDir, "src", "content", "projects"))
  const allImages = new Map([...blogImages, ...projectImages])

  console.log(`Found ${allImages.size} unique images to optimize`)

  let processed = 0
  let skipped = 0

  for (const [relativePath, mdxFiles] of allImages) {
    const absolutePath = path.join(rootDir, relativePath)

    try {
      await fs.access(absolutePath)
    } catch {
      console.warn(`Image not found: ${relativePath} (referenced in ${mdxFiles.join(", ")})`)
      continue
    }

    const pathHash = slugifyPath(relativePath)
    const type = mdxFiles[0].includes("/blog/") ? "blog" : "projects"
    const outputDir = path.join(OUTPUT_DIR, type, pathHash)

    // Check if already optimized and unchanged
    const stats = await fs.stat(absolutePath)
    const manifestEntry = existingManifest[relativePath]

    if (manifestEntry) {
      const firstSizePath = path.join(rootDir, "public", manifestEntry["400"])
      try {
        const optimizedStats = await fs.stat(firstSizePath)
        if (optimizedStats.mtime >= stats.mtime) {
          manifest[relativePath] = manifestEntry
          skipped++
          continue
        }
      } catch {
        // Optimized file doesn't exist, re-process
      }
    }

    const optimizedPaths = await optimizeImage(absolutePath, outputDir, "cover")
    manifest[relativePath] = optimizedPaths
    processed++
  }

  // Write manifest
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2))

  // Cleanup old images
  await cleanupOldOptimizedImages(existingManifest, manifest)

  const duration = ((Date.now() - startTime) / 1000).toFixed(2)
  console.log(`
Done in ${duration}s:
  - Processed: ${processed} images
  - Skipped: ${skipped} images (unchanged)
  - Total unique images: ${Object.keys(manifest).length}
  - Manifest: ${MANIFEST_PATH}
  - Output: ${OUTPUT_DIR}
  `)
}

main().catch((error) => {
  console.error("Failed to optimize images:", error)
  process.exit(1)
})
