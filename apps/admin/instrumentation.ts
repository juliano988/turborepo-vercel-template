import { registerSubscriber } from "@repo/mq";
import { FILE_ADDED, USER_CREATED } from "@repo/events";

export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") {
    return;
  }

  await registerSubscriber(
    USER_CREATED,
    `${process.env.NEXT_PUBLIC_ADMIN_URL}/admin/api/events/user_created`
  );

  await registerSubscriber(
    FILE_ADDED,
    `${process.env.NEXT_PUBLIC_ADMIN_URL}/admin/api/events/file_added`
  );
}
