import { NextRequest } from "next/server";
import { FileRepository } from "../../../../repository/File";
import { UserRepository } from "../../../../repository/User";
import { serveBlob } from "@repo/storage";
import { requireSession } from "../../../utils/requireSession";
import { DownloadFileByNameUseCase } from "../../../../useCases/DownloadFileByNameUseCase";
import { UserId } from "../../../../agregates/User/vo/UserId";

type RouteContext = {
  params: Promise<{ slug: string[] }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { slug } = await context.params;
  const segments = Array.isArray(slug) ? slug : [];

  if (segments.length === 0 || segments.length > 2) {
    return new Response("Filename is required", { status: 400 });
  }

  const [first, second] = segments;
  const filenameCandidate = second ?? first;
  const decodedFilename = decodeURIComponent(filenameCandidate ?? "");

  if (!decodedFilename) {
    return new Response("Filename is required", { status: 400 });
  }

  const apiKey = second ? first : undefined;
  let ownerId: string;

  if (apiKey?.trim()) {
    const repository = new UserRepository();
    const user = await repository.findByApiKey(apiKey.trim());

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    ownerId = user.id.toString();
  } else {
    const session = await requireSession();
    ownerId = session.user.id;
  }

  const fileRepository = new FileRepository();
  const userRepository = new UserRepository();
  const service = new DownloadFileByNameUseCase(userRepository, fileRepository);
  const result = await service.execute({
    filename: decodedFilename,
    ownerId: UserId.from(ownerId),
    apiKey,
  });

  if (!result.file) {
    return new Response("Not found", { status: 404 });
  }

  const response = await serveBlob(result.file.blobUrl.toString(), "private");

  response.headers.set(
    "Content-Disposition",
    `attachment; filename="${encodeURIComponent(result.file.name)}"`
  );

  return response;
}
