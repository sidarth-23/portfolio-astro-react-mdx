import { getViteConfig } from "astro/config"
import { defineConfig } from "vitest/config"

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
}

const viteConfig = getViteConfig(config as Parameters<typeof getViteConfig>[0])

export default defineConfig(viteConfig as Parameters<typeof defineConfig>[0])
