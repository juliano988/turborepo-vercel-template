import { FileId } from "../File/vo/FileId";
import { UserProps } from "./types";
import { UserId } from "./vo/UserId";

export class User {
  public readonly id: UserId;
  public filesId?: Array<FileId>;

  private constructor(props: UserProps) {
    this.id = props.id;
    this.filesId = props.filesId;
  }

  static create(): User {
    return new User({ id: UserId.create(), filesId: [] });
  }

  static reconstitute(props: UserProps): User {
    return new User(props);
  }
}
