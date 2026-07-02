import { createAuthClient } from "better-auth/react";

// Browser : window.location.origin (preview e production corretamente)
// SSR     : fallback para NEXT_PUBLIC_BETTER_AUTH_URL
const baseURL =
  typeof window !== "undefined"
    ? window.location.origin
    : process.env.NEXT_PUBLIC_BETTER_AUTH_URL;

export const authClient = createAuthClient({ baseURL });

export const { signIn, signUp, signOut, useSession, getSession } = authClient;
