import fs from "node:fs"
import path from "node:path"
import { generateText } from "ai"
import type { ProviderConfig } from "./ai-providers"
import { createModel } from "./ai-providers"

export interface TranslateOptions {
  providerConfig: ProviderConfig
  rulesPath: string
  targetLocales?: string[]
  contentTypes?: string[]
  rootDir: string
  force?: boolean
}

function parseFrontmatter(content: string): { frontmatter: string; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) {
    return { frontmatter: "", body: content }
  }
  return { frontmatter: match[1], body: match[2] }
}

export async function translateContent(
  sourceContent: string,
  targetLocale: string,
  rules: string,
  model: Awaited<ReturnType<typeof createModel>>
): Promise<string> {
  const { frontmatter, body } = parseFrontmatter(sourceContent)

  const systemPrompt = `You are a professional translator. Translate the following MDX content from English to ${targetLocale}.

Follow these rules strictly:
${rules}

Return ONLY the translated MDX file content, preserving the exact frontmatter format (--- delimiters), MDX component syntax, code blocks, and markdown structure. Do not add any explanatory text.`

  const fullContent = frontmatter
    ? `---\n${frontmatter}\n---\n${body}`
    : body

  const { text } = await generateText({
    model,
    system: systemPrompt,
    prompt: fullContent,
    temperature: 0.3,
  })

  // Clean up any markdown code block wrappers the AI might add
  return text.replace(/^```mdx?\n/, "").replace(/\n```$/, "").trim()
}

async function translateFile(
  sourcePath: string,
  targetLocale: string,
  rules: string,
  model: Awaited<ReturnType<typeof createModel>>,
  force: boolean
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
      // Already translated, skip unless force
      if (!force) {
        console.log(`  Skipping ${targetPath} (already exists)`)
        return
      }
    }
  }

  console.log(`  Translating to ${targetLocale}: ${path.relative(process.cwd(), targetPath)}`)
  const translated = await translateContent(content, targetLocale, rules, model)

  // Ensure locale field is set correctly
  const withLocale = translated.replace(
    /locale:\s*"en"/,
    `locale: "${targetLocale}"`
  )

  fs.writeFileSync(targetPath, withLocale, "utf-8")
}

export async function translateAll(options: TranslateOptions): Promise<void> {
  const {
    providerConfig,
    rulesPath,
    targetLocales = ["hi", "fr"],
    contentTypes = ["blog", "projects"],
    rootDir,
    force = false,
  } = options

  const model = await createModel(providerConfig)
  const rules = fs.readFileSync(rulesPath, "utf-8")

  for (const contentType of contentTypes) {
    const enDir = path.join(rootDir, "src", "content", contentType, "en")
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
      for (const locale of targetLocales) {
        await translateFile(sourcePath, locale, rules, model, force)
      }
    }
  }
}
