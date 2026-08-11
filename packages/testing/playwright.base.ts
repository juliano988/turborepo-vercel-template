import { defineConfig, devices } from "@playwright/test";

export * from "@playwright/test";

export type PlaywrightBaseOptions = {
  baseURL: string;
  testDir?: string;
  outputDir?: string;
};

export function createPlaywrightConfig({
  baseURL,
  testDir = "e2e",
  outputDir = "test-results",
}: PlaywrightBaseOptions) {
  return defineConfig({
    testDir,
    outputDir,
    testMatch: "**/*.e2e.spec.ts",
    fullyParallel: true,
    forbidOnly: !!process.env["CI"],
    retries: process.env["CI"] ? 1 : 0,
    workers: process.env["CI"] ? 1 : undefined,
    reporter: process.env["CI"] ? "github" : "list",
    use: {
      baseURL,
      trace: "on-first-retry",
      screenshot: "only-on-failure",
    },
    projects: [
      {
        name: "chromium",
        use: { ...devices["Desktop Chrome"] },
      },
    ],
  });
}
