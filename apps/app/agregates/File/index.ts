import { UserId } from "../User/vo/UserId";
import { CreateFileProps, FileProps } from "./types";
import { BlobUrl } from "./vo/BlobUrl";
import { FileId } from "./vo/FileId";
import { FileName } from "./vo/FileName";
import { FileSize } from "./vo/FileSize";
import { MimeType } from "./vo/MimeType";

export class File {
  public readonly id: FileId;
  public readonly name: FileName;
  public readonly size: FileSize;
  public readonly mimeType: MimeType;
  public readonly ownerId: UserId;
  public readonly blobUrl: BlobUrl;
  public readonly uploadedAt: Date;

  private constructor(props: FileProps) {
    this.id = props.id;
    this.name = props.name;
    this.size = props.size;
    this.mimeType = props.mimeType;
    this.ownerId = props.ownerId;
    this.blobUrl = props.blobUrl;
    this.uploadedAt = props.uploadedAt;
  }

  /** Cria um novo arquivo (gera id e uploadedAt automaticamente). */
  static create(props: CreateFileProps): File {
    return new File({
      id: FileId.create(),
      name: FileName.from(props.name),
      size: FileSize.from(props.sizeBytes),
      mimeType: MimeType.from(props.mimeType),
      ownerId: UserId.from(props.ownerId),
      blobUrl: BlobUrl.from(props.blobUrl),
      uploadedAt: new Date(),
    });
  }

  /** Reconstitui um arquivo a partir de dados persistidos (sem regerar id/data). */
  static reconstitute(props: FileProps): File {
    return new File(props);
  }

  isOwnedBy(userId: UserId): boolean {
    return this.ownerId.equals(userId);
  }

  toJSON() {
    return {
      id: this.id.toString(),
      name: this.name.full,
      size: this.size.toBytes(),
      mimeType: this.mimeType.toString(),
      ownerId: this.ownerId.toString(),
      blobUrl: this.blobUrl.toString(),
      uploadedAt: this.uploadedAt.toISOString(),
    };
  }
}
