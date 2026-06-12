// @ts-check

import tailwindcss from "@tailwindcss/vite"
import { defineConfig, envField } from "astro/config"
import react from "@astrojs/react"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import cloudflare from "@astrojs/cloudflare"
import { execFileSync } from "node:child_process"
import path from "node:path"
import { loadEnv } from "vite"
import rehypeSlug from "rehype-slug"
import { filenameTransformer } from "./src/lib/codeblock/shiki"
import { rehypeCodeBlocks } from "./src/lib/codeblock/rehype"
import { remarkCodeGroup } from "./src/lib/codeblock/remark"

const { SITE_URL: siteUrl } = loadEnv(process.env.NODE_ENV ?? "production", import.meta.dirname, "")
if (!siteUrl) {
  throw new Error("SITE_URL is required. Set it in .env or the process environment.")
}

const usePolling = process.env.ASTRO_USE_POLLING === "true"

function generateSearchIndex() {
  execFileSync("bun", ["scripts/generate-search-index.ts"], {
    stdio: "inherit",
  })
}

/** @type {import('astro').AstroIntegration} */
const searchIndexIntegration = {
  name: "generate-search-index",
  hooks: {
    // Fires for dev, build, and `astro sync` (which `astro check` runs),
    // replacing the previous predev/prebuild/pretypecheck npm scripts.
    "astro:config:done": () => {
      generateSearchIndex()
    },
    "astro:server:setup": ({ server }) => {
      const watchedRoots = [
        path.resolve(import.meta.dirname, "src/content/blog"),
        path.resolve(import.meta.dirname, "src/content/profile-experience"),
        path.resolve(import.meta.dirname, "src/content/content.ts"),
      ]
      /** @type {ReturnType<typeof setTimeout> | undefined} */
      let timer
      const onChange = (/** @type {string} */ file) => {
        if (!watchedRoots.some((root) => file.startsWith(root))) return
        clearTimeout(timer)
        timer = setTimeout(() => {
          try {
            generateSearchIndex()
          } catch (error) {
            console.error("[search-index] regeneration failed:", error)
          }
        }, 300)
      }
      server.watcher.on("add", onChange)
      server.watcher.on("change", onChange)
      server.watcher.on("unlink", onChange)
    },
  },
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
    ...(usePolling
      ? {
          server: {
            watch: {
              usePolling: true,
              interval: 500,
            },
          },
        }
      : {}),
    plugins: [tailwindcss()],
  },
  integrations: [
    searchIndexIntegration,
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
