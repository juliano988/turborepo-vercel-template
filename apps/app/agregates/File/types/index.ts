import { UserId } from "../../User/vo/UserId";
import { FileId } from "../vo/FileId";
import { FileName } from "../vo/FileName";
import { FileSize } from "../vo/FileSize";
import { MimeType } from "../vo/MimeType";
import { BlobUrl } from "../vo/BlobUrl";

export type FileProps = {
  id: FileId;
  name: FileName;
  size: FileSize;
  mimeType: MimeType;
  ownerId: UserId;
  blobUrl: BlobUrl;
  uploadedAt: Date;
};

export type CreateFileProps = {
  name: string;
  sizeBytes: number;
  mimeType: string;
  ownerId: string;
  blobUrl: string;
};
