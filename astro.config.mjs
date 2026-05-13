// @ts-check

import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import { checkTranslations, formatReport } from "./scripts/check-translations.ts"

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [
      tailwindcss(),
      {
        name: "i18n-translation-check",
        buildStart() {
          console.log("\n🔍 Checking translations...")
          const result = checkTranslations()
          console.log(formatReport(result))
          if (!result.ok) {
            throw new Error("Translation check failed. Run `npm run translate` to fix.")
          }
        },
      },
    ],
  },
  integrations: [react(), mdx(), sitemap()],
  site: "https://sidshub.in",
  i18n: {
    locales: ["en", "hi", "fr"],
    defaultLocale: "en",
    routing: {
      prefixDefaultLocale: true,
    },
  },
})
