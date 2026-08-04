"use server";

import { UserId } from "../../agregates/User/vo/UserId";
import { FileRepository } from "../../repository/File";
import { UserRepository } from "../../repository/User";
import { DownloadFileByNameService } from "../../services/DownloadFileByNameService";
import { requireSession } from "./requireSession";

export async function downloadFileByNameAction(filename: string) {
  const session = await requireSession();

  const repository = new FileRepository();
  const userRepository = new UserRepository();
  const service = new DownloadFileByNameService(userRepository, repository);

  return service.execute({
    filename,
    ownerId: UserId.from(session.user.id),
    apiKey: session.user.id,
  });
}
