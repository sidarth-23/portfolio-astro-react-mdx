import type { AstroIntegration } from "astro"
import type { ProviderConfig } from "../lib/ai-providers"
import { checkTranslations, formatReport } from "../lib/check-translations"
import { translateAll } from "../lib/translate"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "../..")

export interface TranslateIntegrationOptions {
  /** AI provider configuration. */
  providerConfig: ProviderConfig
  /** Path to the translation rules markdown file. */
  rulesPath?: string
  /**
   * Automatically generate missing/stale translations during build.
   * @default false
   */
  autoTranslate?: boolean
  /** Locales to translate into (excluding the source "en"). */
  targetLocales?: string[]
  /** Content collections to translate. */
  contentTypes?: string[]
}

export function translateIntegration(
  options: TranslateIntegrationOptions
): AstroIntegration {
  const {
    providerConfig,
    rulesPath = path.join(ROOT, "src", "i18n", "rules.md"),
    autoTranslate = false,
    targetLocales = ["es", "fr"],
    contentTypes = ["blog", "projects"],
  } = options

  return {
    name: "translate",
    hooks: {
      "astro:config:setup": ({ updateConfig }) => {
        updateConfig({
          vite: {
            plugins: [
              {
                name: "i18n-translation-check",
                async buildStart() {
                  console.log("\n🔍 Checking translations...")
                  const result = checkTranslations(ROOT)
                  console.log(formatReport(result))

                  if (!result.ok) {
                    if (autoTranslate) {
                      console.log("\n🤖 Auto-translate enabled, generating translations...")
                      await translateAll({
                        providerConfig,
                        rulesPath,
                        targetLocales,
                        contentTypes,
                        rootDir: ROOT,
                        force: false,
                      })
                      console.log("\n✅ Translations generated")
                    } else {
                      throw new Error(
                        "Translation check failed. Run `npm run translate` to fix, or enable autoTranslate in the integration config."
                      )
                    }
                  }
                },
              },
            ],
          },
        })
      },
    },
  }
}
