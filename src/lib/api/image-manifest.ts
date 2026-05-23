import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, "../../..")
const MANIFEST_PATH = path.join(rootDir, "src", "generated", "image-manifest.json")

export interface OptimizedImageSet {
  "400": string
  "600": string
  "1200": string
}

export interface ImageManifest {
  [originalPath: string]: OptimizedImageSet
}

let cachedManifest: ImageManifest | null = null
let manifestMtime: number | null = null

async function loadManifest(): Promise<ImageManifest> {
  try {
    const stats = await fs.stat(MANIFEST_PATH)
    const currentMtime = stats.mtimeMs

    if (cachedManifest && manifestMtime === currentMtime) {
      return cachedManifest
    }

    const content = await fs.readFile(MANIFEST_PATH, "utf-8")
    const manifest = JSON.parse(content) as ImageManifest

    cachedManifest = manifest
    manifestMtime = currentMtime

    return manifest
  } catch {
    return {}
  }
}

export async function getOptimizedImageSet(originalPath: string): Promise<OptimizedImageSet | null> {
  const manifest = await loadManifest()

  // Try direct match
  if (manifest[originalPath]) {
    return manifest[originalPath]
  }

  // Try with different path formats (relative vs absolute)
  const variations = [
    originalPath,
    originalPath.replace(/^(\.\.\/)+/, ""), // Remove all leading ../
    path.relative(rootDir, path.resolve(rootDir, originalPath)),
  ]

  for (const variation of variations) {
    if (manifest[variation]) {
      return manifest[variation]
    }
  }

  return null
}

export async function getOptimizedImageSrc(
  originalPath: string,
  size: keyof OptimizedImageSet = "600"
): Promise<string> {
  const set = await getOptimizedImageSet(originalPath)
  if (set) {
    return set[size]
  }

  // Fallback: return original path if optimization not available
  // In production, this will likely 404 for assets/ images, but it's the best we can do
  return originalPath
}

export function generateSrcSet(set: OptimizedImageSet): string {
  return `${set["400"]} 400w, ${set["600"]} 600w, ${set["1200"]} 1200w`
}

export function generateSizes(
  options: { mobile?: string; tablet?: string; desktop?: string } = {}
): string {
  const { mobile = "100vw", tablet = "50vw", desktop = "33vw" } = options
  return `(max-width: 640px) ${mobile}, (max-width: 1024px) ${tablet}, ${desktop}`
}

export function clearManifestCache(): void {
  cachedManifest = null
  manifestMtime = null
}
