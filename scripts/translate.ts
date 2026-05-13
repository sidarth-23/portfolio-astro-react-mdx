#!/usr/bin/env node
/**
 * Translation script for MDX content.
 *
 * Usage:
 *   AI_API_KEY=sk-xxx AI_API_URL=https://api.openai.com/v1/chat/completions node scripts/translate.ts
 *
 * Environment variables:
 *   AI_API_KEY      - API key for the AI service
 *   AI_API_URL      - API endpoint (default: OpenAI compatible)
 *   AI_MODEL        - Model name (default: gpt-4o-mini)
 */

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "..")

const locales = ["hi", "fr"]
const contentTypes = ["blog", "projects"]

const AI_API_KEY = process.env.AI_API_KEY
const AI_API_URL = process.env.AI_API_URL || "https://api.openai.com/v1/chat/completions"
const AI_MODEL = process.env.AI_MODEL || "gpt-4o-mini"

async function callAI(messages: Array<{ role: string; content: string }>): Promise<string> {
  if (!AI_API_KEY) {
    throw new Error("AI_API_KEY environment variable is required")
  }

  const res = await fetch(AI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AI_API_KEY}`,
    },
    body: JSON.stringify({
      model: AI_MODEL,
      messages,
      temperature: 0.3,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`AI API error: ${res.status} ${text}`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content ?? ""
}

function parseFrontmatter(content: string): { frontmatter: string; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) {
    return { frontmatter: "", body: content }
  }
  return { frontmatter: match[1], body: match[2] }
}

async function translateContent(
  sourceContent: string,
  targetLocale: string,
  rules: string
): Promise<string> {
  const { frontmatter, body } = parseFrontmatter(sourceContent)

  const systemPrompt = `You are a professional translator. Translate the following MDX content from English to ${targetLocale}.

Follow these rules strictly:
${rules}

Return ONLY the translated MDX file content, preserving the exact frontmatter format (--- delimiters), MDX component syntax, code blocks, and markdown structure. Do not add any explanatory text.`

  const fullContent = frontmatter
    ? `---\n${frontmatter}\n---\n${body}`
    : body

  const translated = await callAI([
    { role: "system", content: systemPrompt },
    { role: "user", content: fullContent },
  ])

  // Clean up any markdown code block wrappers the AI might add
  return translated.replace(/^```mdx?\n/, "").replace(/\n```$/, "").trim()
}

async function translateFile(
  sourcePath: string,
  targetLocale: string,
  rules: string
): Promise<void> {
  const content = fs.readFileSync(sourcePath, "utf-8")
  const targetPath = sourcePath.replace("/en/", `/${targetLocale}/`)

  const targetDir = path.dirname(targetPath)
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true })
  }

  if (fs.existsSync(targetPath)) {
    const existing = fs.readFileSync(targetPath, "utf-8")
    if (existing.includes("locale:")) {
      // Already translated, skip unless --force
      if (!process.argv.includes("--force")) {
        console.log(`  Skipping ${targetPath} (already exists)`)
        return
      }
    }
  }

  console.log(`  Translating to ${targetLocale}: ${path.relative(ROOT, targetPath)}`)
  const translated = await translateContent(content, targetLocale, rules)

  // Ensure locale field is set correctly
  const withLocale = translated.replace(
    /locale:\s*"en"/,
    `locale: "${targetLocale}"`
  )

  fs.writeFileSync(targetPath, withLocale, "utf-8")
}

async function main() {
  console.log("=== MDX Translation ===\n")

  if (!AI_API_KEY) {
    console.error("Error: AI_API_KEY environment variable is required")
    console.error("Example: AI_API_KEY=sk-xxx npm run translate")
    process.exit(1)
  }

  const rulesPath = path.join(ROOT, "src", "i18n", "rules.md")
  const rules = fs.readFileSync(rulesPath, "utf-8")

  for (const contentType of contentTypes) {
    const enDir = path.join(ROOT, "src", "content", contentType, "en")
    if (!fs.existsSync(enDir)) {
      console.log(`Skipping ${contentType} (no en directory)`)
      continue
    }

    const files = fs.readdirSync(enDir).filter((f) => f.endsWith(".mdx"))
    if (files.length === 0) {
      console.log(`No files in ${contentType}/en`)
      continue
    }

    console.log(`\n${contentType}:`)
    for (const file of files) {
      const sourcePath = path.join(enDir, file)
      for (const locale of locales) {
        await translateFile(sourcePath, locale, rules)
      }
    }
  }

  console.log("\n=== Done ===")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
