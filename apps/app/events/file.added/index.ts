import { FILE_ADDED, type FileAddedPayload } from "@repo/events";
import { publish } from "@repo/mq";

export { FILE_ADDED };
export type { FileAddedPayload };

export default async function createFileAddedEvent(
  payload: FileAddedPayload
): Promise<void> {
  try {
    await publish(FILE_ADDED, payload);
  } catch (err) {
    console.error("[app] falha ao publicar file.added:", err);
  }
}
