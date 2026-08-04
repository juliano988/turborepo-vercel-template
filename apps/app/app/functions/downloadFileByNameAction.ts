"use server";

import { UserId } from "../../agregates/User/vo/UserId";
import { FileRepository } from "../../repository/File";
import { UserRepository } from "../../repository/User";
import { DownloadFileByNameUseCase } from "../../useCases/DownloadFileByNameUseCase";
import { requireSession } from "../utils/requireSession";

export async function downloadFileByNameAction(filename: string) {
  const session = await requireSession();

  const repository = new FileRepository();
  const userRepository = new UserRepository();
  const currentUser = await userRepository.findById(UserId.from(session.user.id));
  const service = new DownloadFileByNameUseCase(userRepository, repository);

  return service.execute({
    filename,
    ownerId: UserId.from(session.user.id),
    apiKey: currentUser?.apiKey?.toString() ?? undefined,
  });
}
