import { User } from "../../../agregates/User";
import { UserId } from "../../../agregates/User/vo/UserId";

export interface UserRepository {
  findById(id: UserId): Promise<User | null>;
}
