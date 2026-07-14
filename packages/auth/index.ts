export { USER_CREATED } from "@repo/events";
export type { UserCreatedPayload } from "@repo/events";
export { toNextJsHandler } from "better-auth/next-js";
export { auth, getSessionFromHeaders, requireSessionFromHeaders } from "./auth";
export type { Session, User } from "./auth";

