import { configDefaults, defineConfig, mergeConfig } from "vitest/config";
import type { UserConfig } from "vitest/config";

export const defaultCoverageExclusions = [
  ...configDefaults.exclude,
  "**/*.d.ts",
  "**/next.config.*",
  "**/eslint.config.*",
  "**/postcss.config.*",
  "**/*.config.*",
  "**/.next/**",
  "**/coverage/**"
];

const sharedTestConfig = defineConfig({
  test: {
    clearMocks: true,
    restoreMocks: true,
    mockReset: true,
    passWithNoTests: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: defaultCoverageExclusions
    }
  }
});

export function createSharedTestConfig(overrides: UserConfig = {}) {
  return mergeConfig(sharedTestConfig, defineConfig(overrides));
}

export function createNodeTestConfig(overrides: UserConfig = {}) {
  return createSharedTestConfig({
    test: {
      environment: "node",
      include: ["**/*.unit.spec.ts", "**/*.integration.spec.ts"]
    },
    ...overrides
  });
}
