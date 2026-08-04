import { FileId } from "../../File/vo/FileId";
import { UserId } from "../vo/UserId";

export type UserProps = {
  id: UserId;
  filesId?: Array<FileId>;
  apiKey?: string | null;
};
