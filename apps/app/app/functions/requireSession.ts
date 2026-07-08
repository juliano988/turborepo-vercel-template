import { auth } from "@repo/auth";
import { headers } from "next/headers";

export async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
  return session;
}
