#!/usr/bin/env node
/**
 * Translation script for MDX content.
 *
 * Usage:
 *   AI_API_KEY=sk-xxx npm run translate
 *   AI_API_KEY=sk-xxx npm run translate -- --force
 *
 * This is a thin CLI wrapper around src/lib/translate.ts.
 */

import path from "node:path"
import { fileURLToPath } from "node:url"
import { translateAll } from "../src/lib/translate"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "..")

const AI_API_KEY = process.env.AI_API_KEY

async function main() {
  console.log("=== MDX Translation ===\n")

  if (!AI_API_KEY) {
    console.error("Error: AI_API_KEY environment variable is required")
    console.error("Example: AI_API_KEY=sk-xxx npm run translate")
    process.exit(1)
  }

  const rulesPath = path.join(ROOT, "src", "i18n", "rules.md")
  const force = process.argv.includes("--force")

  await translateAll({
    providerConfig: {
      provider: "openai",
      model: process.env.AI_MODEL || "gpt-4o-mini",
      apiKey: AI_API_KEY,
      baseURL: process.env.AI_API_URL,
    },
    rulesPath,
    targetLocales: ["hi", "fr"],
    contentTypes: ["blog", "projects"],
    rootDir: ROOT,
    force,
  })

  console.log("\n=== Done ===")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
