import { existsSync, mkdirSync } from "node:fs"
import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import matter from "gray-matter"

const RESUME_SOURCE = path.resolve(process.cwd(), "src/content/resume/en.md")
const OUTPUT_DIR = path.resolve(process.cwd(), "public/resume")

function ensureOutputDir() {
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true })
  }
}

async function main() {
  ensureOutputDir()

  const rawSource = await readFile(RESUME_SOURCE, "utf-8")
  const parsed = matter(rawSource)
  const markdown = parsed.content.trim()

  await writeFile(path.join(OUTPUT_DIR, "sidarth-resume.md"), `${markdown}\n`)

  console.log("Generated: resume/sidarth-resume.md")
}

main().catch((error) => {
  console.error("Resume export generation failed:", error)
  process.exit(1)
})
