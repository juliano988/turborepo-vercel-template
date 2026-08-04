import { User } from "..";
import { UserId } from "../vo/UserId";

export interface iUserRepository {
  findById(id: UserId): Promise<User | null>;
  findByApiKey(apiKey: string): Promise<User | null>;
}
