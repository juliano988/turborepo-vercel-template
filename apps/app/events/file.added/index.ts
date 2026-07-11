import { publish } from "@repo/mq";
import { FILE_ADDED } from "./constants";
import type { FileAddedPayload } from "./types";

export { FILE_ADDED } from "./constants";
export type { FileAddedPayload } from "./types";

export default async function createFileAddedEvent(
  payload: FileAddedPayload
): Promise<void> {
  try {
    await publish(FILE_ADDED, payload);
  } catch (err) {
    console.error("[app] falha ao publicar file.added:", err);
  }
}
