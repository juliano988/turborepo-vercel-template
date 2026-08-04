import { createNodeTestConfig } from "../../packages/testing/vitest.node.ts";
import { defineConfig } from "vitest/config";

export default defineConfig(
  createNodeTestConfig({
    test: {
      include: ["active_records/**/*.integration.spec.ts"],
      passWithNoTests: false,
      testTimeout: 30000,
      hookTimeout: 30000,
    },
  })
);
