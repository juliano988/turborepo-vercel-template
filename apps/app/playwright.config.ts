import { createPlaywrightConfig } from "@repo/testing/playwright";

// PLAYWRIGHT_BASE_URL points to the landing proxy — all app traffic goes through port 3000
export default createPlaywrightConfig({
  baseURL: process.env["PLAYWRIGHT_BASE_URL"] ?? "http://localhost:3000",
  testDir: "e2e",
  outputDir: "e2e/test-results",
});
