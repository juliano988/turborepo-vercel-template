import { File } from "../../../agregates/File";

export type ListUserFilesInput = {
  ownerId: string;
};

export type ListUserFilesOutput = ReturnType<File["toJSON"]>[];
