import { File } from "../../../agregates/File";
import { UserId } from "../../../agregates/User/vo/UserId";

export type ListUserFilesInput = {
  ownerId: UserId;
};

export type ListUserFilesOutput = ReturnType<File["toJSON"]>[];
