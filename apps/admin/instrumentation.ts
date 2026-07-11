import { registerSubscriber } from "@repo/mq";
import { USER_CREATED } from "@repo/auth";

export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") {
    return;
  }

  await registerSubscriber(
    USER_CREATED,
    `${process.env.NEXT_PUBLIC_ADMIN_URL}/admin/api/events/user_created`
  );
}
