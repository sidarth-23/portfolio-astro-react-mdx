// @ts-check

import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import rehypeSlug from "rehype-slug"
import { translateIntegration } from "./src/integrations/translate"
import { filenameTransformer } from "./src/lib/shiki/transformers.ts"

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      transformers: [filenameTransformer()],
    },
  },
  integrations: [
    react(),
    mdx({
      rehypePlugins: [rehypeSlug],
    }),
    sitemap(),
    translateIntegration({
      providerConfig: {
        provider: "openai",
        model: process.env.AI_MODEL || "gpt-4o-mini",
        apiKey: process.env.AI_API_KEY,
        baseURL: process.env.AI_API_URL,
      },
      // Set autoTranslate: true to generate missing translations during build.
      // Off by default so builds are deterministic and don't consume API quota.
      autoTranslate: false,
    }),
  ],
  site: "https://sidshub.in",
  i18n: {
    locales: ["en", "es", "fr"],
    defaultLocale: "en",
    routing: {
      prefixDefaultLocale: true,
    },
  },
})
