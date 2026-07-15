import { publish } from "@repo/mq";
import { USER_CREATED, type UserCreatedPayload } from "@repo/events";

export { USER_CREATED };
export type { UserCreatedPayload };

export default async function createUserEvent(user: UserCreatedPayload) {
  try {
    await publish(USER_CREATED, user, [
      `${process.env.NEXT_PUBLIC_APP_URL}/app/api/events/user_created`,
      `${process.env.NEXT_PUBLIC_ADMIN_URL}/admin/api/events/user_created`,
    ]);
  } catch (err) {
    console.error("[auth] falha ao publicar user.created:", err);
  }
}
