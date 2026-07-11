import { prisma } from "@repo/db";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import createUserEvent from "./events/user.created";

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
  user: { modelName: "authUser" },
  session: { modelName: "authSession" },
  account: { modelName: "authAccount" },
  verification: { modelName: "authVerification" },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  trustedOrigins: getTrustedOrigins(),
  emailAndPassword: {
    enabled: true,
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await createUserEvent({
            id: user.id,
            name: user.name,
            email: user.email,
            emailVerified: user.emailVerified,
            image: user.image ?? null,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            role: typeof user.role === "string" ? user.role : null,
          });
        },
      },
    },
  },
  socialProviders: {},
  plugins: [
    admin({
      defaultRole: "user",
    }),
  ],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;

/**
 * Obtém a sessão atual a partir dos cabeçalhos da requisição.
 *
 * Retorna `null` quando não existe sessão válida.
 */
export async function getSessionFromHeaders(headers: Headers) {
  return auth.api.getSession({ headers });
}

/**
 * Obtém a sessão atual e exige autenticação.
 *
 * @throws Error quando não há sessão válida.
 */
export async function requireSessionFromHeaders(
  headers: Headers
): Promise<Session> {
  const session = await getSessionFromHeaders(headers);

  if (!session) {
    throw new Error("Unauthorized");
  }

  return session;
}
