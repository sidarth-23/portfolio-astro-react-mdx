// @ts-check

import tailwindcss from "@tailwindcss/vite"
import { defineConfig, envField } from "astro/config"
import react from "@astrojs/react"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import cloudflare from "@astrojs/cloudflare"
import { execFileSync } from "node:child_process"
import { loadEnv } from "vite"
import rehypeSlug from "rehype-slug"
import { filenameTransformer } from "./src/lib/codeblock/shiki"
import { rehypeCodeBlocks } from "./src/lib/codeblock/rehype"
import { remarkCodeGroup } from "./src/lib/codeblock/remark"

const { SITE_URL: siteUrl } = loadEnv(process.env.NODE_ENV ?? "production", import.meta.dirname, "")
if (!siteUrl) {
  throw new Error("SITE_URL is required. Set it in .env or the process environment.")
}

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare({
    imageService: {
      build: "compile",
      runtime: "cloudflare-binding",
    },
  }),
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    {
      name: "generate-og-images",
      hooks: {
        "astro:build:start": () => {
          execFileSync("bun", ["scripts/generate-og-images.ts"], {
            stdio: "inherit",
          })
        },
      },
    },
    react(),
    mdx({
      remarkPlugins: [remarkCodeGroup],
      rehypePlugins: [rehypeSlug, rehypeCodeBlocks],
    }),
    sitemap(),
  ],
  markdown: {
    shikiConfig: {
      transformers: [filenameTransformer()],
    },
  },
  site: siteUrl,
  env: {
    schema: {
      SITE_URL: envField.string({ context: "server", access: "public", url: true }),
    },
  },
  i18n: {
    locales: ["en", "es", "fr"],
    defaultLocale: "en",
    routing: {
      prefixDefaultLocale: true,
    },
  },
})
