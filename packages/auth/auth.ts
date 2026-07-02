import { prisma } from "@repo/db";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

function getTrustedOrigins(): string[] {
  const urlRegex = /^https?:\/\//;

  const origins = new Set<string>(
    Object.values(process.env)
      .filter((v): v is string => !!v && urlRegex.test(v))
      .flatMap((v) => {
        try {
          return [new URL(v).origin];
        } catch {
          return [];
        }
      })
  );;

  // VERCEL_BRANCH_URL não tem protocolo e não é detectada pelo regex acima.
  // Em preview deploys, deriva e confia nos origins de todos os apps irmãos
  // da mesma branch para que o proxy da landing funcione corretamente.
  const branchUrl = process.env.VERCEL_BRANCH_URL;
  if (branchUrl) {
    const match = branchUrl.match(/(-git-.+\.vercel\.app)$/);
    if (match) {
      const suffix = match[1];
      for (const project of ["landing", "app", "admin", "auth", "docs"]) {
        origins.add(`https://${project}${suffix}`);
      }
    }
  }

  return [...origins];
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  trustedOrigins: getTrustedOrigins(),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {},
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
