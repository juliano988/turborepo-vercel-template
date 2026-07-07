export type ServerFile = {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  ownerId: string;
  blobUrl: string;
  uploadedAt: string;
};

export interface StoredFile {
  uid: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  status: "uploading" | "done" | "error";
}
