import { createNodeTestConfig } from "../../packages/testing/vitest.node.ts";
import { defineConfig } from "vitest/config";

export default defineConfig(
  createNodeTestConfig({
    test: {
      exclude: ["**/*.integration.spec.ts"],
      include: [
        "agregates/**/*.unit.spec.ts",
        "repository/**/*.unit.spec.ts",
        "useCases/**/*.unit.spec.ts",
        "app/functions/**/*.unit.spec.ts",
        "app/api/**/*.unit.spec.ts",
      ],
    },
  })
);
