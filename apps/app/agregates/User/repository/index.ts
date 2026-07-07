import { User } from "..";
import { UserId } from "../vo/UserId";

export interface UserRepository {
  findById(id: UserId): Promise<User | null>;
}
