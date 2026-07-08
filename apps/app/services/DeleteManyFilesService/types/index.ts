import { UserId } from "../../../agregates/User/vo/UserId";

export type DeleteManyFilesInput = {
  ownerId: UserId;
  fileIds: string[];
};

export type DeleteManyFilesOutput = {
  deletedFileIds: string[];
  skippedFileIds: string[];
};
