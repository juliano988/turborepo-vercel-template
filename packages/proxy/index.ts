import type { NextConfig } from "next";

/**
 * Configuração central de roteamento do monorepo.
 * Fonte única de verdade para base paths, env vars e projetos Vercel de cada app.
 *
 * Para adicionar um novo sub-app, basta incluir uma entrada aqui.
 */
export const apps = {
  landing: {
    basePath: "/",
    envVar: "NEXT_PUBLIC_BETTER_AUTH_URL",
    vercelProject: "turborepo-vercel-template-landing",
  },
  app: {
    basePath: "/app",
    envVar: "NEXT_PUBLIC_APP_URL",
    vercelProject: "turborepo-vercel-template-app",
  },
  admin: {
    basePath: "/admin",
    envVar: "NEXT_PUBLIC_ADMIN_URL",
    vercelProject: "turborepo-vercel-template-admin",
  },
  docs: {
    basePath: "/docs",
    envVar: "NEXT_PUBLIC_DOCS_URL",
    vercelProject: "turborepo-vercel-template-docs",
  },
} as const;

export type AppKey = keyof typeof apps;
/**
 * Define o basePath correto para um sub-app e carrega o .env do monorepo.
 *
 * @example
 * // apps/app/next.config.js
 * import { withBasePath } from '@repo/proxy';
 * export default withBasePath('app');
 */
export function withBasePath(
  app: Exclude<keyof typeof apps, "landing">,
  nextConfig: NextConfig = {}
): NextConfig {
  return { ...nextConfig, basePath: apps[app].basePath };
}

/**
 * Gera as rewrites de proxy para o landing apontar para cada sub-app.
 * Lê automaticamente as URLs de process.env com base na config central.
 *
 * @example
 * // apps/landing/next.config.js
 * import { withEnv } from '@repo/env';
 * import { getProxyRewrites } from '@repo/proxy';
 * export default withEnv({ async rewrites() { return getProxyRewrites(); } });
 */
export function getProxyRewrites() {
  const proxied = Object.values(apps).filter((app) => app.basePath !== "/");
  return proxied.flatMap(({ basePath, envVar }) => {
    const url = (process.env[envVar] as string | undefined) ?? "";
    return [
      { source: basePath, destination: `${url}${basePath}` },
      { source: `${basePath}/:path*`, destination: `${url}${basePath}/:path*` },
    ];
  });
}
