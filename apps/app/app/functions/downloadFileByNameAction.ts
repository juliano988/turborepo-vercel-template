"use server";

import { UserId } from "../../agregates/User/vo/UserId";
import { FileRepository } from "../../repository/File";
import { DownloadFileByNameService } from "../../services/DownloadFileByNameService";
import { requireSession } from "./requireSession";

export async function downloadFileByNameAction(filename: string) {
  const session = await requireSession();

  const repository = new FileRepository();
  const service = new DownloadFileByNameService(repository);

  return service.execute({
    filename,
    ownerId: UserId.from(session.user.id),
  });
}
