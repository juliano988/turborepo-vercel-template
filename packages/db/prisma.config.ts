import { defineConfig } from "prisma/config";

// Prisma 7 desabilita o carregamento automático do .env — restauramos aqui.
// O dev-migrate.sh escreve packages/db/.env com a DATABASE_URL local.
try {
  process.loadEnvFile(".env");
} catch {}

export default defineConfig({
  schema: "prisma/schema",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? process.env.PRISMA_DATABASE_URL,
    shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL,
  },
});
