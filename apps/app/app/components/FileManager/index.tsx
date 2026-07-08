"use client";

import { CloudUpload, Inbox, Link2, ThemeToggleAntd, Trash2 } from "@repo/ui";
import {
  Button,
  message,
  Progress,
  Space,
  Tag,
  theme,
  Tooltip,
  Typography,
  Upload,
} from "antd";
import { useState, useTransition } from "react";
import { formatBytes } from "./modules/formatBytes";
import { fromServer } from "./modules/fromServer";
import { getFileColor } from "./modules/getFileColor";
import { getFileIcon } from "./modules/getFileIcon";
import type { ServerFile, StoredFile } from "./types";
import { uploadFileAction } from "../../functions/uploadFileAction";

const { Title, Text } = Typography;
const { Dragger } = Upload;

export function FileManager({ initialFiles }: { initialFiles: ServerFile[] }) {
  const { token } = theme.useToken();
  const [isPending, startTransition] = useTransition();
  const [files, setFiles] = useState<StoredFile[]>(() =>
    initialFiles.map(fromServer)
  );
  const [isDragging, setIsDragging] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleBeforeUpload = (file: globalThis.File) => {
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
    <div
      style={{
        minHeight: "100dvh",
        background: token.colorBgLayout,
      }}
    >
      {contextHolder}

      {/* Header */}
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 40,
          marginBottom: 40,
        }}
      >
        <Space align="center" size={12}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: token.colorPrimary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CloudUpload size={18} color="#fff" />
          </div>
          <div>
            <Text
              strong
              style={{ display: "block", fontSize: 15, lineHeight: "20px" }}
            >
              FileVault
            </Text>
            <Text type="secondary" style={{ fontSize: 12, lineHeight: "16px" }}>
              Armazenamento simples
            </Text>
          </div>
        </Space>
        <ThemeToggleAntd />
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        {/* Upload Zone */}
        <div
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
          onDrop={() => setIsDragging(false)}
          style={{ marginBottom: 32 }}
        >
          <Dragger
            multiple
            showUploadList={false}
            beforeUpload={handleBeforeUpload}
            style={{
              borderRadius: 16,
              border: `2px dashed ${isDragging ? token.colorPrimary : token.colorBorderSecondary}`,
              background: isDragging
                ? token.colorPrimaryBg
                : token.colorBgContainer,
              transition: "all 0.2s ease",
              padding: "8px",
            }}
          >
            <div style={{ padding: "32px 16px" }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 16,
                  background: isDragging
                    ? token.colorPrimary
                    : token.colorFillSecondary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                  transition: "all 0.2s ease",
                }}
              >
                <Inbox
                  size={28}
                  color={isDragging ? "#fff" : token.colorPrimary}
                />
              </div>
              <Title level={4} style={{ margin: "0 0 8px", fontWeight: 600 }}>
                Arraste arquivos aqui
              </Title>
              <Text type="secondary" style={{ fontSize: 14 }}>
                ou{" "}
                <Text style={{ color: token.colorPrimary, fontWeight: 500 }}>
                  clique para selecionar
                </Text>{" "}
                do seu dispositivo
              </Text>
              <div style={{ marginTop: 16 }}>
                <Space size={8} wrap style={{ justifyContent: "center" }}>
                  {["Imagens", "PDFs", "Documentos", "Qualquer arquivo"].map(
                    (label) => (
                      <Tag
                        key={label}
                        style={{
                          borderRadius: 20,
                          fontSize: 11,
                          padding: "2px 10px",
                          border: `1px solid ${token.colorBorderSecondary}`,
                          background: token.colorFillQuaternary,
                        }}
                      >
                        {label}
                      </Tag>
                    )
                  )}
                </Space>
              </div>
            </div>
          </Dragger>
        </div>

        {/* Uploading */}
        {uploadingFiles.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <Text
              type="secondary"
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: 12,
              }}
            >
              Enviando ({uploadingFiles.length})
            </Text>
            <Space direction="vertical" style={{ width: "100%" }} size={8}>
              {uploadingFiles.map((file) => (
                <div
                  key={file.uid}
                  style={{
                    background: token.colorBgContainer,
                    borderRadius: 12,
                    padding: "14px 16px",
                    border: `1px solid ${token.colorBorderSecondary}`,
                  }}
                >
                  <Space style={{ width: "100%", marginBottom: 8 }}>
                    <span style={{ color: token.colorPrimary }}>
                      {getFileIcon(file.type)}
                    </span>
                    <Text style={{ fontSize: 13, flex: 1 }} ellipsis>
                      {file.name}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {formatBytes(file.size)}
                    </Text>
                  </Space>
                  <Progress
                    percent={isPending ? 70 : 100}
                    status={isPending ? "active" : "success"}
                    showInfo={false}
                    strokeColor={token.colorPrimary}
                    trailColor={token.colorFillSecondary}
                    size="small"
                    style={{ margin: 0 }}
                  />
                </div>
              ))}
            </Space>
          </div>
        )}

        {/* Error files */}
        {errorFiles.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <Text
              type="danger"
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: 12,
              }}
            >
              Falhou ({errorFiles.length})
            </Text>
            <Space direction="vertical" style={{ width: "100%" }} size={8}>
              {errorFiles.map((file) => (
                <div
                  key={file.uid}
                  style={{
                    background: token.colorBgContainer,
                    borderRadius: 12,
                    padding: "12px 16px",
                    border: `1px solid ${token.colorErrorBorder}`,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <span style={{ color: token.colorError }}>
                    {getFileIcon(file.type)}
                  </span>
                  <Text style={{ fontSize: 13, flex: 1 }} ellipsis>
                    {file.name}
                  </Text>
                  <Button
                    type="text"
                    size="small"
                    danger
                    icon={<Trash2 size={14} />}
                    onClick={() => removeFile(file.uid)}
                  />
                </div>
              ))}
            </Space>
          </div>
        )}

        {/* Done files */}
        {doneFiles.length > 0 && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <Text
                type="secondary"
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Arquivos ({doneFiles.length})
              </Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {formatBytes(doneFiles.reduce((acc, f) => acc + f.size, 0))}{" "}
                total
              </Text>
            </div>
            <Space direction="vertical" style={{ width: "100%" }} size={6}>
              {doneFiles.map((file) => (
                <div
                  key={file.uid}
                  style={{
                    background: token.colorBgContainer,
                    borderRadius: 12,
                    padding: "12px 16px",
                    border: `1px solid ${token.colorBorderSecondary}`,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    transition: "border-color 0.15s",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: `${getFileColor(file.type)}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      color: getFileColor(file.type),
                    }}
                  >
                    {getFileIcon(file.type)}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Text
                      style={{
                        display: "block",
                        fontSize: 13,
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {file.name}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      {formatBytes(file.size)} ·{" "}
                      {file.uploadedAt.toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </div>

                  <Space size={4}>
                    <Tooltip title="Copiar link">
                      <Button
                        type="text"
                        size="small"
                        icon={<Link2 size={14} />}
                        style={{ color: token.colorTextSecondary }}
                        onClick={() => copyLink(file.uid)}
                      />
                    </Tooltip>
                    <Tooltip title="Remover">
                      <Button
                        type="text"
                        size="small"
                        danger
                        icon={<Trash2 size={14} />}
                        onClick={() => removeFile(file.uid)}
                      />
                    </Tooltip>
                  </Space>
                </div>
              ))}
            </Space>
          </div>
        )}

        {/* Empty state */}
        {files.length === 0 && (
          <div style={{ textAlign: "center", padding: "16px 0 8px" }}>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Nenhum arquivo enviado ainda. Comece arrastando ou selecionando
              arquivos acima.
            </Text>
          </div>
        )}
      </div>
    </div>
  );
}
