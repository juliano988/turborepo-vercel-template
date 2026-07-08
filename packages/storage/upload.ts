import { put, type BlobAccessType, type PutBlobResult } from "@vercel/blob";

export type { BlobAccessType, PutBlobResult };

export type UploadOptions = {
  /** Prefixo de pasta dentro do store. Ex: "users/123/" */
  folder?: string;
  /** Content-type explícito. Por padrão é inferido do pathname. */
  contentType?: string;
  /**
   * Nível de acesso do blob.
   * - `"public"`: URL diretamente acessível.
   * - `"private"`: Requer autenticação — use `serveBlob()` para servir.
   * @defaultvalue "private"
   */
  access?: BlobAccessType;
  /** Adiciona sufixo aleatório ao nome para evitar colisões. @defaultvalue true */
  addRandomSuffix?: boolean;
  /**
   * Usa upload multipart (paralelo). Recomendado para arquivos grandes.
   * @defaultvalue false
   */
  multipart?: boolean;
};

/**
 * Faz upload de um arquivo para o Vercel Blob.
 *
 * @param filename  Nome do arquivo (ex: "foto.jpg")
 * @param body      Conteúdo: File, Blob, ReadableStream, Buffer ou string
 * @param options   Opções adicionais
 * @returns         Metadados do blob criado, incluindo `url` e `downloadUrl`
 */
export async function upload(
  filename: string,
  body: Parameters<typeof put>[1],
  options: UploadOptions = {}
): Promise<PutBlobResult> {
  const pathname = options.folder
    ? `${options.folder.replace(/\/$/, "")}/${filename}`
    : filename;

  return put(pathname, body, {
    access: options.access ?? "private",
    addRandomSuffix: options.addRandomSuffix ?? true,
    multipart: options.multipart ?? false,
    ...(options.contentType ? { contentType: options.contentType } : {}),
  });
}
