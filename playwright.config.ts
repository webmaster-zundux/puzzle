import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config({
  path: resolve(dirname(fileURLToPath(import.meta.url)), ".env"),
});
console.log(`playwright config: using environment variables from .env to construct the config`);

const getDemoPuzzleStorageStatePath = () => {
  return resolve(dirname(fileURLToPath(import.meta.url)), "./src/__e2e-tests__/playwright/.setup/demo-puzzle-2x1.json");
};

export default defineConfig({
  testDir: "./src/__e2e-tests__/playwright",
  outputDir: "./src/__e2e-tests__/playwright/test-results",

  testIgnore: "examples/**/*",

  timeout: 15_000,
  expect: { timeout: 50 },

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,

  workers: 1,

  reporter: process.env.CI ? "dot" : [["list"], ["html"]],

  use: {
    storageState: getDemoPuzzleStorageStatePath(),

    viewport: { width: 1280, height: 720 },

    baseURL: "https://localhost:5173/",
    ignoreHTTPSErrors: process.env.USE_BASIC_SSL_CERTS === "1" ? true : false,

    screenshot: "only-on-failure",
    trace: "on-first-retry",
  },

  projects: [
    { name: "demo-puzzle-7x4-setup", testMatch: /demo-puzzle-7x4\.setup\.ts/ },
    { name: "demo-puzzle-2x1-setup", testMatch: /demo-puzzle-2x1\.setup\.ts/ },

    { name: "setup", grep: /@setup/i },
    { name: "smoke", grep: /@smoke/i },
    { name: "normal", grepInvert: [/@smoke/i, /@setup/i] },

    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: process.env.PLAYWRIGHT_TESTING_USE_FULLSCREEN_MODE ? null : devices["Desktop Chrome"].viewport,
        deviceScaleFactor: process.env.PLAYWRIGHT_TESTING_USE_FULLSCREEN_MODE
          ? undefined
          : devices["Desktop Chrome"].deviceScaleFactor,
        launchOptions: process.env.PLAYWRIGHT_TESTING_USE_FULLSCREEN_MODE
          ? { args: ["--start-maximized"] } // for chromium only
          : undefined,
      },
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
  ],

  webServer: {
    command: "npm run start",
    reuseExistingServer: !process.env.CI,
    port: 5173,
    // url: 'https://localhost:5173/', // when use url with `https` then `ignoreHTTPSErrors` should be true (for playwright tests)
    ignoreHTTPSErrors: process.env.USE_BASIC_SSL_CERTS === "1" ? true : false,
    timeout: 10_000,
  },
});
