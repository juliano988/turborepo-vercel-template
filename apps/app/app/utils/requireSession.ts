import { requireSessionFromHeaders } from "@repo/auth";
import { headers } from "next/headers";

export async function requireSession() {
  return requireSessionFromHeaders(await headers());
}
