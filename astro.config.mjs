// @ts-check

import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import cloudflare from "@astrojs/cloudflare"
import { execFileSync } from "node:child_process"
import rehypeSlug from "rehype-slug"
import { filenameTransformer } from "./src/lib/codeblock/shiki"
import { rehypeCodeBlocks } from "./src/lib/codeblock/rehype"
import { remarkCodeGroup } from "./src/lib/codeblock/remark"

const isTest = typeof process !== "undefined" && process.env.VITEST !== undefined

// https://astro.build/config
export default defineConfig({
  adapter: isTest
    ? undefined
    : cloudflare({
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
    {
      name: "generate-resume-exports",
      hooks: {
        "astro:build:start": () => {
          execFileSync("bun", ["scripts/generate-resume-exports.ts"], {
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
  site: "https://sidshub.in",
  i18n: {
    locales: ["en", "es", "fr"],
    defaultLocale: "en",
    routing: {
      prefixDefaultLocale: true,
    },
  },
})
