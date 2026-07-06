import { get, type BlobAccessType } from "@vercel/blob";

/**
 * Faz proxy server-side de um blob, para uso em route handlers autenticados.
 *
 * @example
 * // apps/app/app/api/files/route.ts
 * import { serveBlob } from "@repo/storage";
 *
 * export async function GET(request: NextRequest) {
 *   // Autentique o request aqui antes de servir
 *   const pathname = request.nextUrl.searchParams.get("pathname")!;
 *   return serveBlob(pathname, "private");
 * }
 */
export async function serveBlob(
  urlOrPathname: string,
  access: BlobAccessType = "private"
): Promise<Response> {
  const result = await get(urlOrPathname, { access });

  if (result === null) {
    return new Response("Not found", { status: 404 });
  }

  // 304 Not Modified — blob não mudou desde o último request condicional
  if (result.statusCode === 304) {
    return new Response(null, { status: 304, headers: result.headers });
  }

  return new Response(result.stream, {
    status: 200,
    headers: {
      "Cache-Control": "private, no-cache",
      "Content-Type": result.blob.contentType,
      "X-Content-Type-Options": "nosniff",
    },
  });
}
