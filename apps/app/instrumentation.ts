import { USER_CREATED } from "@repo/events";
import { registerSubscriber } from "@repo/mq";

export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") {
    return;
  }

  await registerSubscriber(
    USER_CREATED,
    `${process.env.NEXT_PUBLIC_APP_URL}/app/api/events/user_created`
  );
}
