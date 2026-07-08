# @repo/storage

Abstração sobre o [Vercel Blob](https://vercel.com/docs/vercel-blob) para upload, serve e gerenciamento de arquivos.

## Variáveis de ambiente

```env
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."
BLOB_STORE_ID="store_..."        # necessário para referenciar arquivos por pathname
```

## API

### `upload(filename, body, options?)`

Faz upload de um arquivo. Por padrão usa `access: "private"` e sufixo aleatório.

```ts
import { upload } from "@repo/storage";

const blob = await upload("foto.jpg", file, {
  folder: "users/123", // opcional — prefixo de pasta
  access: "private", // "public" | "private" (padrão: "private")
  multipart: true, // recomendado para arquivos grandes
});

console.log(blob.url); // URL do blob
console.log(blob.downloadUrl); // URL com Content-Disposition: attachment
```

---

### `serveBlob(urlOrPathname, access?)`

Proxy server-side para servir blobs privados em route handlers autenticados.

```ts
// apps/app/app/api/files/route.ts
import { serveBlob } from "@repo/storage";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // autentique o request antes de servir
  const pathname = request.nextUrl.searchParams.get("pathname")!;
  return serveBlob(pathname, "private");
}
```

Trata automaticamente `304 Not Modified` para requests condicionais.

---

### `getFileDownloadUrl(blobUrl)`

Retorna a URL com `Content-Disposition: attachment` para forçar download no browser.

```ts
import { getFileDownloadUrl } from "@repo/storage";

const downloadUrl = getFileDownloadUrl(blob.url);
```

---

### `getMetadata(urlOrPathname)`

Retorna metadados do blob ou `null` se não existir.

```ts
import { getMetadata } from "@repo/storage";

const meta = await getMetadata("users/123/foto.jpg");
// { url, pathname, contentType, size, uploadedAt, ... } | null
```

---

### `listFiles(prefix?)`

Lista blobs armazenados, com filtro opcional por prefixo.

```ts
import { listFiles } from "@repo/storage";

const { blobs } = await listFiles("users/123/");
```

---

### `remove(urls)`

Remove um ou mais blobs por URL ou pathname.

```ts
import { remove } from "@repo/storage";

await remove(blob.url);
await remove([url1, url2]);
```

## Estrutura

```
packages/storage/
  index.ts      ← re-exporta tudo
  upload.ts     ← upload()
  serve.ts      ← serveBlob()
  download.ts   ← getFileDownloadUrl()
  metadata.ts   ← getMetadata()
  list.ts       ← listFiles()
  delete.ts     ← remove()
```
