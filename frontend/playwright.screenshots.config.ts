import { defineConfig, devices } from "@playwright/test";

// Separate config for the one-off screenshot capture script — keeps it out
// of the real e2e test run (playwright.config.ts only looks in ./e2e).
export default defineConfig({
  testDir: "./scripts",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
