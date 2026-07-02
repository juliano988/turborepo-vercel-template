import { createAuthClient } from "better-auth/react";

// Production : NEXT_PUBLIC_BETTER_AUTH_URL definida no Vercel Dashboard
// Preview    : não definida no Dashboard → usa o origin atual da página
//              (o proxy da landing encaminha /api/auth/* para o app auth)
// Development: definida no .env local
const getBaseURL = (): string | undefined => {
  const configured = process.env.NEXT_PUBLIC_BETTER_AUTH_URL?.trim();
  if (configured) return configured;
  if (typeof window !== "undefined") return window.location.origin;
  return undefined;
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;
