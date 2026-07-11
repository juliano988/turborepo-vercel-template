import { File } from "..";

export type FileProps = {
  id: string;
  name: string;
  sizeBytes: number;
  mimeType: string;
  ownerId: string;
  blobUrl: string;
  uploadedAt: Date;
};

export type FileListInput = {
  page?: number;
  pageSize?: number;
  search?: string;
  ownerId?: string;
  mimeType?: string;
};

export type FileListOutput = {
  data: File[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};
