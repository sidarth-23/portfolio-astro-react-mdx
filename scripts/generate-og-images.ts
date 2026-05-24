import { existsSync, mkdirSync } from "fs"
import { writeFile, readFile } from "fs/promises"
import path from "path"
import { renderOgImage } from "../src/lib/seo/generate-image"

const OUTPUT_DIR = path.resolve(process.cwd(), "public/og")

async function main() {
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  // Read shared page SEO config
  const configPath = path.resolve(process.cwd(), "src/content/page-seo.json")
  const configRaw = await readFile(configPath, "utf-8")
  const config = JSON.parse(configRaw) as Record<
    string,
    Record<string, { title: string; description: string }>
  >

  console.log(`Generating OG images for ${Object.keys(config).length} page types`)

  for (const [pageName, byLocale] of Object.entries(config)) {
    for (const [locale, { title, description }] of Object.entries(byLocale)) {
      try {
        const buffer = await renderOgImage({ title, description })
        const filename = `og-${pageName}-${locale}.png`
        const outputPath = path.join(OUTPUT_DIR, filename)
        await writeFile(outputPath, buffer)
        console.log(`Generated: ${filename}`)
      } catch (error) {
        console.error(`Failed to generate OG image for ${pageName}-${locale}:`, error)
      }
    }
  }

  console.log("OG image generation complete!")
}

main().catch((error) => {
  console.error("OG image generation failed:", error)
  process.exit(1)
})
