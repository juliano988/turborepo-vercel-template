#!/usr/bin/env bun
/**
 * Gera .env.local derivando URLs de apps do monorepo a partir de VERCEL_BRANCH_URL.
 * Executado como "prebuild" em Preview Deploys na Vercel.
 * Em desenvolvimento local e em Production, encerra sem fazer nada.
 *
 * Uso (sem argumentos - le vercel-env.json do cwd):
 *   bun ../../scripts/vercel-env.ts
 *
 * Uso (com argumentos explicitos):
 *   bun ../../scripts/vercel-env.ts NEXT_PUBLIC_APP_URL=app NEXT_PUBLIC_BETTER_AUTH_URL=landing
 *
 * Variaveis de sistema usadas (injetadas automaticamente pela Vercel):
 *   VERCEL_ENV        - "production" | "preview" | "development"
 *   VERCEL_BRANCH_URL - URL da branch atual, ex: app-git-my-feature-myteam.vercel.app
 *                       Formato garantido: [project]-git-[branch]-[team].vercel.app
 *
 * Requer que os projetos Vercel sejam nomeados de forma consistente
 * com os valores em vercel-env.json (ex: "app", "admin", "auth", "docs", "landing").
 */
import { writeFileSync, readFileSync } from "fs";

const { VERCEL_ENV, VERCEL_BRANCH_URL } = process.env;

// So executa em Preview Deploys.
// Em producao, use as variaveis configuradas no Vercel Dashboard.
if (VERCEL_ENV !== "preview") {
  console.log(`VERCEL_ENV="${VERCEL_ENV ?? "undefined"}" - usando valores do ambiente ou .env local.`);
  process.exit(0);
}

if (!VERCEL_BRANCH_URL) {
  console.warn("VERCEL_BRANCH_URL nao encontrada. Pulando derivacao de URLs.");
  process.exit(0);
}

// Extrai o sufixo "-git-[branch]-[team].vercel.app" de VERCEL_BRANCH_URL.
// Exemplo: "app-git-my-feature-myteam.vercel.app" -> "-git-my-feature-myteam.vercel.app"
const match = VERCEL_BRANCH_URL.match(/(-git-.+\.vercel\.app)$/);

if (!match) {
  console.warn(
    `VERCEL_BRANCH_URL "${VERCEL_BRANCH_URL}" nao corresponde ao padrao esperado ` +
      "([project]-git-[branch]-[team].vercel.app). Pulando derivacao de URLs.",
  );
  process.exit(0);
}

const suffix = match[1];
const args = process.argv.slice(2);

// Sem args: le vercel-env.json do diretorio do app (cwd)
// Com args: usa os pares VAR_NAME=project-name passados diretamente
let mappings: Record<string, string>;

if (args.length === 0) {
  try {
    mappings = JSON.parse(readFileSync("vercel-env.json", "utf-8")) as Record<string, string>;
  } catch {
    console.error("Nenhum argumento fornecido e vercel-env.json nao encontrado no diretorio atual.");
    process.exit(1);
  }
} else {
  mappings = Object.fromEntries(
    args.map((arg) => {
      const eq = arg.indexOf("=");
      if (eq === -1) {
        console.error(`Argumento invalido: "${arg}". Esperado: VAR_NAME=project-name`);
        process.exit(1);
      }
      return [arg.slice(0, eq), arg.slice(eq + 1)];
    }),
  );
}

const lines = Object.entries(mappings).map(
  ([varName, projectName]) => `${varName}=https://${projectName}${suffix}`,
);

writeFileSync(".env.local", lines.join("\n") + "\n");
console.log("URLs derivadas de VERCEL_BRANCH_URL e escritas em .env.local:");
lines.forEach((l: string) => console.log(" ", l));
