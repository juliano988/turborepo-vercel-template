#!/usr/bin/env bun
/**
 * Gera .env derivando URLs de apps do monorepo a partir de VERCEL_BRANCH_URL.
 * Executado como "prebuild" em todos os deploys da Vercel (preview e production).
 * Em desenvolvimento local, encerra sem fazer nada.
 *
 * Uso (sem argumentos - usa a config central de @repo/proxy):
 *   bun ../../scripts/vercel-env.ts
 *
 * Uso (com argumentos explicitos para override):
 *   bun ../../scripts/vercel-env.ts NEXT_PUBLIC_APP_URL=trvt-app
 *
 * Variaveis de sistema usadas (injetadas automaticamente pela Vercel):
 *   VERCEL_ENV        - "production" | "preview" | "development"
 *   VERCEL_BRANCH_URL - URL da branch atual (preview), ex: app-git-my-feature-myteam.vercel.app
 *                       Formato garantido: [project]-git-[branch]-[team].vercel.app
 *
 * Os nomes dos projetos Vercel sao definidos centralmente em packages/proxy/config.ts.
 */
import { apps } from "@repo/proxy";
import { writeFileSync } from "fs";

const { VERCEL_ENV, VERCEL_BRANCH_URL } = process.env;

// Nao executa em desenvolvimento local (usa valores do .env local).
if (!VERCEL_ENV || VERCEL_ENV === "development") {
  console.log(
    `VERCEL_ENV="${VERCEL_ENV ?? "undefined"}" - usando valores do .env local.`
  );
  process.exit(0);
}

// Garante que .env sempre existe na Vercel, evitando erros de lstat em builds cacheados.
writeFileSync(".env", "");

const args = process.argv.slice(2);

// Sem args: le vercel-env.json do diretorio do app (cwd)
// Com args: usa os pares VAR_NAME=project-name passados diretamente
let mappings: Record<string, string>;

if (args.length === 0) {
  mappings = Object.fromEntries(
    Object.values(apps).map(({ envVar, vercelProject }) => [
      envVar,
      vercelProject,
    ])
  );
} else {
  mappings = Object.fromEntries(
    args.map((arg) => {
      const eq = arg.indexOf("=");
      if (eq === -1) {
        console.error(
          `Argumento invalido: "${arg}". Esperado: VAR_NAME=project-name`
        );
        process.exit(1);
      }
      return [arg.slice(0, eq), arg.slice(eq + 1)];
    })
  );
}

// Producao: deriva sufixo de VERCEL_PROJECT_PRODUCTION_URL (ex: -juliano988s-projects.vercel.app)
// para suportar contas pessoais (projeto-usuario-projects.vercel.app) e de time.
// Fallback para project-name.vercel.app se a variavel nao estiver disponivel.
if (VERCEL_ENV === "production") {
  const productionHostname = process.env.VERCEL_PROJECT_PRODUCTION_URL;

  let lines: string[];

  if (productionHostname && productionHostname.endsWith(".vercel.app")) {
    // Encontra qual projeto corresponde a esta URL de producao
    const currentProject = Object.values(mappings).find(
      (name) =>
        productionHostname.startsWith(name + "-") ||
        productionHostname === name + ".vercel.app"
    );

    if (currentProject) {
      // Ex: "trvt-landing-juliano988s-projects.vercel.app" com projeto "trvt-landing"
      //  -> sufixo = "-juliano988s-projects.vercel.app"
      const teamSuffix = productionHostname.slice(currentProject.length);
      lines = Object.entries(mappings).map(
        ([varName, projectName]) =>
          `${varName}=https://${projectName}${teamSuffix}`
      );
    } else {
      lines = Object.entries(mappings).map(
        ([varName, projectName]) =>
          `${varName}=https://${projectName}.vercel.app`
      );
    }
  } else {
    lines = Object.entries(mappings).map(
      ([varName, projectName]) =>
        `${varName}=https://${projectName}.vercel.app`
    );
  }

  writeFileSync(".env", lines.join("\n") + "\n");
  console.log("URLs de producao escritas em .env:");
  lines.forEach((l: string) => console.log(" ", l));
  process.exit(0);
}

// Preview: deriva sufixo de VERCEL_BRANCH_URL
if (!VERCEL_BRANCH_URL) {
  console.warn("VERCEL_BRANCH_URL nao encontrada. Pulando derivacao de URLs.");
  process.exit(0);
}

// Exemplo: "app-git-my-feature-myteam.vercel.app" -> "-git-my-feature-myteam.vercel.app"
const match = VERCEL_BRANCH_URL.match(/(-git-.+\.vercel\.app)$/);

if (!match) {
  console.warn(
    `VERCEL_BRANCH_URL "${VERCEL_BRANCH_URL}" nao corresponde ao padrao esperado ` +
      "([project]-git-[branch]-[team].vercel.app). Pulando derivacao de URLs."
  );
  process.exit(0);
}

const suffix = match[1];

const lines = Object.entries(mappings).map(
  ([varName, projectName]) => `${varName}=https://${projectName}${suffix}`
);

writeFileSync(".env", lines.join("\n") + "\n");
console.log("URLs derivadas de VERCEL_BRANCH_URL e escritas em .env:");
lines.forEach((l: string) => console.log(" ", l));
