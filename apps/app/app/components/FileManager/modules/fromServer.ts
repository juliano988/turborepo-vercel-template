import type { ServerFile, StoredFile } from "../types";

export function fromServer(file: ServerFile): StoredFile {
  return {
    uid: file.id,
    name: file.name,
    size: file.size,
    type: file.mimeType,
    uploadedAt: new Date(file.uploadedAt),
    status: "done",
  };
}
