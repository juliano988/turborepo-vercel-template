import { createAuthClient } from "better-auth/react";

// Inlineado em build time pelo Next.js a partir do .env.local gerado pelo prebuild.
// Preview : https://turborepo-vercel-template-landing-git-[branch]-[team].vercel.app
// Produção: https://turborepo-vercel-template-landing.vercel.app
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URI,
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;
