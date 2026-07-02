import { prisma } from "@repo/db";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

function getTrustedOrigins(): string[] {
  const urlRegex = /^https?:\/\//;

  return [
    ...new Set(
      Object.values(process.env)
        .filter((v): v is string => !!v && urlRegex.test(v))
        .flatMap((v) => {
          try {
            return [new URL(v).origin];
          } catch {
            return [];
          }
        })
    ),
  ];
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
