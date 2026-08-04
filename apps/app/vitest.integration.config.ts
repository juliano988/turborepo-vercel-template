import { createNodeTestConfig } from "../../packages/testing/vitest.node.ts";
import { defineConfig } from "vitest/config";

export default defineConfig(
  createNodeTestConfig({
    test: {
      passWithNoTests: false,
      testTimeout: 30_000,
      hookTimeout: 30_000,
      include: ["repository/**/*.integration.spec.ts"],
    },
  })
);
