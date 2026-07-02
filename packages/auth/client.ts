import { createAuthClient } from "better-auth/react";

const getBaseURL = (): string | undefined => {
  const isServer = typeof window === "undefined";
  const url = isServer
    ? process.env.NEXT_PUBLIC_BETTER_AUTH_URL
    : window.location.origin;

  console.log("[auth/client] getBaseURL called", {
    isServer,
    url,
    NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    windowOrigin:
      typeof window !== "undefined" ? window.location.origin : "N/A",
  });

  return url;
};

const baseURL = getBaseURL();
console.log("[auth/client] createAuthClient with baseURL:", baseURL);

export const authClient = createAuthClient({
  baseURL,
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;
