import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "..")

const targetLocales = ["hi", "fr"]
const contentTypes = ["blog", "projects"]

export function checkTranslations(): { ok: boolean; missing: string[]; stale: string[] } {
  const missing: string[] = []
  const stale: string[] = []

  for (const contentType of contentTypes) {
    const enDir = path.join(ROOT, "src", "content", contentType, "en")
    if (!fs.existsSync(enDir)) continue

    const enFiles = fs.readdirSync(enDir).filter((f) => f.endsWith(".mdx"))

    for (const file of enFiles) {
      const enPath = path.join(enDir, file)
      const enStat = fs.statSync(enPath)

      for (const locale of targetLocales) {
        const targetPath = path.join(ROOT, "src", "content", contentType, locale, file)

        if (!fs.existsSync(targetPath)) {
          missing.push(`${contentType}/${locale}/${file}`)
          continue
        }

        const targetStat = fs.statSync(targetPath)
        if (targetStat.mtime < enStat.mtime) {
          stale.push(`${contentType}/${locale}/${file}`)
        }
      }
    }
  }

  return {
    ok: missing.length === 0 && stale.length === 0,
    missing,
    stale,
  }
}

export function formatReport(result: { ok: boolean; missing: string[]; stale: string[] }): string {
  if (result.ok) {
    return "✅ All translations are up to date"
  }

  const lines: string[] = []

  if (result.missing.length > 0) {
    lines.push("\n❌ Missing translations:")
    for (const file of result.missing) {
      lines.push(`  - ${file}`)
    }
  }

  if (result.stale.length > 0) {
    lines.push("\n⚠️  Stale translations (source modified after translation):")
    for (const file of result.stale) {
      lines.push(`  - ${file}`)
    }
  }

  lines.push("\nRun `npm run translate` to generate missing/stale translations.")
  return lines.join("\n")
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const result = checkTranslations()
  console.log(formatReport(result))
  if (!result.ok) {
    process.exit(1)
  }
}
