import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { existsSync } from 'fs';
import type { NextConfig } from 'next';

/**
 * Sobe a árvore de diretórios até encontrar turbo.json,
 * que marca a raiz do monorepo.
 */
function findMonorepoRoot(startDir: string): string {
  let dir = startDir;
  while (true) {
    if (existsSync(resolve(dir, 'turbo.json'))) {
      return dir;
    }
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return startDir;
}

/**
 * Carrega o `.env` da raiz do monorepo e injeta as variáveis em `process.env`.
 * Variáveis já presentes no ambiente (ex: produção na Vercel) não são sobrescritas.
 *
 * @example
 * // apps/landing/next.config.ts
 * import { withEnv } from '@repo/env';
 * export default withEnv({ ... });
 */
export function withEnv(nextConfig: NextConfig = {}): NextConfig {
  const root = findMonorepoRoot(process.cwd());
  config({ path: resolve(root, '.env'), override: false });
  return nextConfig;
}
