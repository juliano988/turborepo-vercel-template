import withTailwind from "@repo/prettier-config/with-tailwind";

/** @type {import("prettier").Config} */
const config = {
  ...withTailwind,
  // adicione exceções aqui, ex:
  // printWidth: 100,
};

export default config;
