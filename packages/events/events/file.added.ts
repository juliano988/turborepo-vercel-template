export const FILE_ADDED = "file.added" as const;

export type FileAddedPayload = {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  ownerId: string;
  blobUrl: string;
  uploadedAt: string;
};
