import { defineConfig, devices } from "@playwright/test";
import { EnvironmentManager } from "@innovateuk/environment-manager";
import { defineBddConfig } from "playwright-bdd";

const envman = new EnvironmentManager(process.env.TEST_SALESFORCE_SANDBOX);
const creds = envman
  .getEnv("BASIC_AUTH")
  ?.split(/[:|]/g)
  ?.map(x => x.trim());

const httpCredentials =
  creds?.length >= 2
    ? {
        username: creds[0],
        password: creds[1],
      }
    : undefined;

const testDir = defineBddConfig({
  steps: "./src/fixtures/index.ts",
  paths: ["./src/features/**/*.feature"],
});

let baseURL: string | undefined = undefined;

switch (process.env.TEST_SALESFORCE_SANDBOX) {
  case "dev":
  case "demo":
    baseURL = `https://www-acc-${process.env.TEST_SALESFORCE_SANDBOX}.apps.ocp4.innovateuk.ukri.org`;
    break;
  case "sysint":
    baseURL = `https://www-acc-${process.env.TEST_SALESFORCE_SANDBOX}.apps.org-env-0.org.innovateuk.ukri.org`;
    break;
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL,
    httpCredentials,
    trace: "on-first-retry",
    testIdAttribute: "data-qa",
  },
  timeout: 5 * 60 * 2000,
  expect: {
    timeout: 17 * 1000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    /* Test against other web browsers */
    // {
    //   name: "firefox",
    //   use: { ...devices["Desktop Firefox"] },
    // },

    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
