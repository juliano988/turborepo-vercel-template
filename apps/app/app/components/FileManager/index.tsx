"use client";

import { message, theme } from "antd";
import { useState, useTransition } from "react";
import { deleteFilesAction } from "../../functions/deleteFilesAction";
import { downloadFileByNameAction } from "../../functions/downloadFileByNameAction";
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
        const uploadedFile = result.uploadedFiles.at(0);
        const firstFailure = result.failedFiles.at(0);

        if (firstFailure || !uploadedFile) {
          throw new Error(firstFailure?.error || "Falha ao enviar arquivo");
        }

        setFiles((prev) =>
          prev.map((file) =>
            file.uid === uid ? fromServer(uploadedFile) : file
          )
        );
      } catch (err) {
        setFiles((prev) =>
          prev.map((file) =>
            file.uid === uid ? { ...file, status: "error" as const } : file
          )
        );
        messageApi.error(
          `Falha ao enviar "${file.name}": ${err instanceof Error ? err.message : "Erro desconhecido"}`
        );
      }
    });

    return false;
  };

  const handleRemoveFile = (uid: string) => {
    const file = files.find((item) => item.uid === uid);
    if (!file) {
      return;
    }

    if (file.status !== "done") {
      setFiles((prev) => prev.filter((file) => file.uid !== uid));
      return;
    }

    startTransition(async () => {
      try {
        const result = await deleteFilesAction([uid]);

        if (result.deletedFileIds.length === 0) {
          throw new Error("Arquivo não encontrado ou sem permissão");
        }

        setFiles((prev) =>
          prev.filter((file) => !result.deletedFileIds.includes(file.uid))
        );

        if (result.skippedFileIds.length > 0) {
          messageApi.warning("Alguns arquivos não puderam ser removidos");
        }
      } catch (err) {
        messageApi.error(
          `Falha ao remover arquivo: ${err instanceof Error ? err.message : "Erro desconhecido"}`
        );
      }
    });
  };

  const downloadFile = (uid: string) => {
    const file = files.find((item) => item.uid === uid);
    if (!file) {
      return;
    }

    startTransition(async () => {
      try {
        const result = await downloadFileByNameAction(file.name);

        if (!result.downloadUrl) {
          throw new Error("Arquivo não encontrado");
        }

        window.open(result.downloadUrl, "_blank", "noopener,noreferrer");
      } catch (err) {
        messageApi.error(
          `Falha ao baixar "${file.name}": ${err instanceof Error ? err.message : "Erro desconhecido"}`
        );
      }
    });
  };

  const doneFiles = files.filter((file) => file.status === "done");
  const uploadingFiles = files.filter((file) => file.status === "uploading");
  const errorFiles = files.filter((file) => file.status === "error");

  return (
    <div style={{ minHeight: "100dvh", background: token.colorBgLayout }}>
      {contextHolder}

      <FileManagerHeader />

      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
        }}
      >
        <UploadZone
          isDragging={isDragging}
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
          onDrop={() => setIsDragging(false)}
          onBeforeUpload={handleBeforeUpload}
        />

        <div
          style={{
            maxHeight: 400,
            overflowY: "auto",
            paddingRight: 4,
            backgroundColor: "transparent",
          }}
        >
          <UploadingList files={uploadingFiles} isPending={isPending} />

          <ErrorList files={errorFiles} onRemove={handleRemoveFile} />

          <DoneList
            files={doneFiles}
            onRemove={handleRemoveFile}
            onDownloadFile={downloadFile}
          />
        </div>

        {files.length === 0 && <EmptyState />}
      </div>
    </div>
  );
}
