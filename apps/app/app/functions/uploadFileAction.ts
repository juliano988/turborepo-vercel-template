"use server";

import { PrismaFileRepository } from "../../repository/File";
import { UploadFileService } from "../../services/UploadFileService";
import { requireSession } from "./requireSession";

export async function uploadFileAction(formData: FormData) {
  const session = await requireSession();

  const file = formData.get("file") as globalThis.File | null;
  if (!file) throw new Error("Nenhum arquivo enviado");

  const repository = new PrismaFileRepository();
  const service = new UploadFileService(repository);

  return service.execute({
    filename: file.name,
    body: file,
    mimeType: file.type || "application/octet-stream",
    sizeBytes: file.size,
    ownerId: session.user.id,
  });
}
