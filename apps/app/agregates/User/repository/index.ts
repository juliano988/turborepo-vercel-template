import { User } from "..";
import { UserId } from "../vo/UserId";

export interface iUserRepository {
  findById(id: UserId): Promise<User | null>;
}
