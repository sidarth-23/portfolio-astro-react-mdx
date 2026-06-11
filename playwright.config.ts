import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:4321",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 7"] },
    },
    {
      name: "android-real",
      use: {
        ...devices["Pixel 7"],
        baseURL: "http://10.0.2.2:4321",
      },
    },
  ],

  webServer: {
    command:
      "rm -f .wrangler/deploy/config.json && npx wrangler dev dist/server/entry.mjs --config dist/server/wrangler.json --port 4321" +
      (process.env.SITE_URL ? ` --var SITE_URL:${process.env.SITE_URL}` : ""),
    url: "http://localhost:4321",
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
})
