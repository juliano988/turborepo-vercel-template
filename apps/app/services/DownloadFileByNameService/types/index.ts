import { File } from "../../../agregates/File";
import { UserId } from "../../../agregates/User/vo/UserId";

export type DownloadFileByNameInput = {
  filename: string;
  ownerId: UserId;
};

export type DownloadFileByNameOutput = {
  file: ReturnType<File["toJSON"]> | null;
  downloadUrl: string | null;
};
