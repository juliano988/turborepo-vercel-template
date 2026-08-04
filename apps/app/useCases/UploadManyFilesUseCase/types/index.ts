import { File } from "../../../agregates/File";

export type UploadManyFilesItemInput = {
  filename: string;
  body: globalThis.File | Blob | ReadableStream | Buffer;
  mimeType: string;
  sizeBytes: number;
};

export type UploadManyFilesInput = {
  files: UploadManyFilesItemInput[];
  ownerId: string;
  chunkSize?: number;
};

export type UploadManyFilesFailure = {
  filename: string;
  error: string;
};

export type UploadManyFilesOutput = {
  uploadedFiles: ReturnType<File["toJSON"]>[];
  failedFiles: UploadManyFilesFailure[];
};
