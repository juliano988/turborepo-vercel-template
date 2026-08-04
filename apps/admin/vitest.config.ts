import { createNodeTestConfig } from "../../packages/testing/vitest.node.ts";
import { defineConfig } from "vitest/config";

export default defineConfig(
  createNodeTestConfig({
    test: {
      exclude: ["**/*.integration.spec.ts"],
      include: [
        "active_records/**/*.unit.spec.ts",
        "app/**/*.unit.spec.ts",
      ],
    },
  })
);
