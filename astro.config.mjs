// @ts-check

import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import node from "@astrojs/node"
import rehypeSlug from "rehype-slug"
import { filenameTransformer } from "./src/lib/codeblock/shiki"
import { rehypeCodeBlocks } from "./src/lib/codeblock/rehype"
import { remarkCodeGroup } from "./src/lib/codeblock/remark"
// https://astro.build/config
export default defineConfig({
  adapter: node({
    mode: "standalone",
  }),
  vite: {
    plugins: [/** @type {any} */ (tailwindcss())],
  },
  integrations: [
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
