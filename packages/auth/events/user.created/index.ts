import { publish } from "@repo/mq";
import { USER_CREATED, type UserCreatedPayload } from "@repo/events";

export { USER_CREATED };
export type { UserCreatedPayload };

export default async function createUserEvent(user: UserCreatedPayload) {
  try {
    await publish(USER_CREATED, user);
  } catch (err) {
    console.error("[auth] falha ao publicar user.created:", err);
  }
}
