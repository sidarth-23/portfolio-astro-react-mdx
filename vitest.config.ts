import { getViteConfig } from "astro/config"
import { defineConfig } from "vitest/config"
import react from "@astrojs/react"
import { fileURLToPath } from "node:url"

const config = {
  test: {
    environment: "happy-dom",
    environmentMatchGlobs: [
      ["src/**/*.test.ts", "node"],
      ["src/**/*.test.tsx", "happy-dom"],
    ],
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json"],
      include: ["src/**/*.{ts,tsx,astro}"],
      exclude: [
        "src/test/**",
        "src/**/*.d.ts",
        "src/**/*.test.{ts,tsx}",
        "src/**/*.spec.{ts,tsx}",
        "dist/**",
        "e2e/**",
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
}

const viteConfig = getViteConfig(config, {
  configFile: false,
  integrations: [react()],
})

// @ts-expect-error Astro and Vitest bundle different Vite versions, causing type mismatches at the library boundary. The runtime behavior is correct.
export default defineConfig(viteConfig)
