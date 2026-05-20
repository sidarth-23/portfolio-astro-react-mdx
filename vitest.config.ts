import { getViteConfig } from "astro/config"
import { defineConfig } from "vitest/config"

export default defineConfig(
  getViteConfig({
    test: {
      environment: "happy-dom",
      // @ts-expect-error - environmentMatchGlobs is valid at runtime but not in types
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
  })
)
