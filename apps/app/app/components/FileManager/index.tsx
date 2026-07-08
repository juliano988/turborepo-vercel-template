"use client";

import { message, theme } from "antd";
import { useState, useTransition } from "react";
import { uploadFileAction } from "../../functions/uploadFileAction";
import { DoneList } from "./components/DoneList";
import { EmptyState } from "./components/EmptyState";
import { ErrorList } from "./components/ErrorList";
import { FileManagerHeader } from "./components/FileManagerHeader";
import { UploadZone } from "./components/UploadZone";
import { UploadingList } from "./components/UploadingList";
import { fromServer } from "./modules/fromServer";
import type { ServerFile, StoredFile } from "./types";

export function FileManager({ initialFiles }: { initialFiles: ServerFile[] }) {
  const { token } = theme.useToken();
  const [isPending, startTransition] = useTransition();
  const [files, setFiles] = useState<StoredFile[]>(() =>
    initialFiles.map(fromServer)
  );
  const [isDragging, setIsDragging] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleBeforeUpload = (file: globalThis.File): false => {
    const uid = `uploading-${Date.now()}-${Math.random()}`;

    setFiles((prev) => [
      {
        uid,
        name: file.name,
        size: file.size,
        type: file.type || "application/octet-stream",
        uploadedAt: new Date(),
        status: "uploading",
      },
      ...prev,
    ]);

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const result = await uploadFileAction(formData);

        setFiles((prev) =>
          prev.map((f) => (f.uid === uid ? fromServer(result) : f))
        );
      } catch (err) {
        setFiles((prev) =>
          prev.map((f) =>
            f.uid === uid ? { ...f, status: "error" as const } : f
          )
        );
        messageApi.error(
          `Falha ao enviar "${file.name}": ${err instanceof Error ? err.message : "Erro desconhecido"}`
        );
      }
    });

    return false;
  };

  const removeFile = (uid: string) => {
    setFiles((prev) => prev.filter((f) => f.uid !== uid));
  };

  const copyLink = (uid: string) => {
    const file = files.find((f) => f.uid === uid);
    if (!file) {
      return;
    }
    // blobUrl não está no StoredFile — link gerado via API futuramente
    messageApi.info("Link copiado (em breve)");
  };

  const doneFiles = files.filter((f) => f.status === "done");
  const uploadingFiles = files.filter((f) => f.status === "uploading");
  const errorFiles = files.filter((f) => f.status === "error");

  return (
    <div style={{ minHeight: "100dvh", background: token.colorBgLayout }}>
      {contextHolder}

      <FileManagerHeader />

      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <UploadZone
          isDragging={isDragging}
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
          onDrop={() => setIsDragging(false)}
          onBeforeUpload={handleBeforeUpload}
        />

        <UploadingList files={uploadingFiles} isPending={isPending} />

        <ErrorList files={errorFiles} onRemove={removeFile} />

        <DoneList
          files={doneFiles}
          onRemove={removeFile}
          onCopyLink={copyLink}
        />

        {files.length === 0 && <EmptyState />}
      </div>
    </div>
  );
}
