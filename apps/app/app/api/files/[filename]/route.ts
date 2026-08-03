import { NextRequest } from "next/server";
import { UserId } from "../../../../agregates/User/vo/UserId";
import { FileRepository } from "../../../../repository/File";
import { DownloadFileByNameService } from "../../../../services/DownloadFileByNameService";
import { requireSession } from "../../../functions/requireSession";
import { serveBlob } from "@repo/storage";

type RouteContext = {
  params: Promise<{ filename: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const session = await requireSession();
  const { filename } = await context.params;
  const decodedFilename = decodeURIComponent(filename);

  if (!decodedFilename) {
    return new Response("Filename is required", { status: 400 });
  }

  const repository = new FileRepository();
  const service = new DownloadFileByNameService(repository);
  const result = await service.execute({
    filename: decodedFilename,
    ownerId: UserId.from(session.user.id),
  });

  if (!result.file || !result.downloadUrl) {
    return new Response("Not found", { status: 404 });
  }

  const response = await serveBlob(result.file.blobUrl.toString(), "private");

  response.headers.set(
    "Content-Disposition",
    `attachment; filename="${encodeURIComponent(result.file.name)}"`
  );

  return response;
}
