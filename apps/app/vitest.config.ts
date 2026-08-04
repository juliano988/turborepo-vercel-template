import { createNodeTestConfig } from "../../packages/testing/vitest.node.ts";
import { defineConfig } from "vitest/config";

export default defineConfig(
  createNodeTestConfig({
    test: {
      exclude: ["**/*.integration.spec.ts"],
      include: [
        "agregates/**/*.{test,spec}.ts",
        "repository/**/*.{test,spec}.ts",
        "useCases/**/*.{test,spec}.ts",
        "app/functions/**/*.{test,spec}.ts",
        "app/api/**/*.{test,spec}.ts",
      ],
    },
  })
);
