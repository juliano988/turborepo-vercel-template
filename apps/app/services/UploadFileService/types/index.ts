import { File } from "../../../agregates/File";

export type UploadFileInput = {
  filename: string;
  body: globalThis.File | Blob | ReadableStream | Buffer;
  mimeType: string;
  sizeBytes: number;
  ownerId: string;
};

export type UploadFileOutput = ReturnType<File["toJSON"]>;
