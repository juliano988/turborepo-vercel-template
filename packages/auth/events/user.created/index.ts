import { publish } from "@repo/mq";
import type { UserCreatedPayload } from "./types";

export { USER_CREATED } from "./constants";
export type { UserCreatedPayload } from "./types";

export default async function createUserEvent(user: UserCreatedPayload) {
  try {
    await publish("user.created", user);
  } catch (err) {
    console.error("[auth] falha ao publicar user.created:", err);
  }
}
