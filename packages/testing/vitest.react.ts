import { defineConfig, mergeConfig } from "vitest/config";
import type { UserConfig } from "vitest/config";
import { createSharedTestConfig } from "./vitest.shared.ts";

const reactTestConfig = defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    css: true,
    setupFiles: ["@repo/testing/setup/react"],
    include: ["**/*.{test,spec}.{ts,tsx}"]
  }
});

export function createReactTestConfig(overrides: UserConfig = {}) {
  return mergeConfig(createSharedTestConfig(), mergeConfig(reactTestConfig, defineConfig(overrides)));
}
