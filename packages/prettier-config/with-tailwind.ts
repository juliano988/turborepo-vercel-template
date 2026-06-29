import type { Config } from "prettier";
import * as tailwindPlugin from "prettier-plugin-tailwindcss";
import baseConfig from "./index.ts";

const config: Config = {
  ...baseConfig,
  plugins: [tailwindPlugin],
};

export default config;
