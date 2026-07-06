"use client";

import { useState } from "react";
import {
  Upload,
  Typography,
  Button,
  Space,
  Tag,
  Tooltip,
  Progress,
  theme,
} from "antd";
import type { UploadProps } from "antd";
import {
  File,
  FileImage,
  FileText,
  FileArchive,
  Link2,
  Trash2,
  CloudUpload,
  Inbox,
  ThemeToggleAntd,
} from "@repo/ui";

const { Title, Text } = Typography;
const { Dragger } = Upload;

function getFileIcon(type: string) {
  if (type.startsWith("image/")) return <FileImage size={20} />;
  if (type === "application/pdf") return <FileText size={20} />;
  if (type.includes("zip") || type.includes("rar") || type.includes("7z"))
    return <FileArchive size={20} />;
  if (type.includes("word") || type.includes("doc"))
    return <FileText size={20} />;
  if (type.includes("excel") || type.includes("sheet") || type.includes("csv"))
    return <FileText size={20} />;
  if (type.startsWith("text/")) return <FileText size={20} />;
  return <File size={20} />;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function getFileColor(type: string): string {
  if (type.startsWith("image/")) return "#52c41a";
  if (type === "application/pdf") return "#ff4d4f";
  if (type.includes("zip") || type.includes("rar")) return "#faad14";
  if (type.includes("word") || type.includes("doc")) return "#1677ff";
  if (type.includes("excel") || type.includes("sheet")) return "#52c41a";
  if (type.startsWith("text/")) return "#722ed1";
  return "#8c8c8c";
}

interface StoredFile {
  uid: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  status: "uploading" | "done" | "error";
  percent?: number;
}

export default function Page() {
  const { token } = theme.useToken();
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const uploadProps: UploadProps = {
    multiple: true,
    showUploadList: false,
    beforeUpload: (file) => {
      const newFile: StoredFile = {
        uid: `${Date.now()}-${Math.random()}`,
        name: file.name,
        size: file.size,
        type: file.type || "application/octet-stream",
        uploadedAt: new Date(),
        status: "uploading",
        percent: 0,
      };

      setFiles((prev) => [newFile, ...prev]);

      // Simula progresso de upload
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30 + 10;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setFiles((prev) =>
            prev.map((f) =>
              f.uid === newFile.uid ? { ...f, status: "done", percent: 100 } : f
            )
          );
        } else {
          setFiles((prev) =>
            prev.map((f) =>
              f.uid === newFile.uid
                ? { ...f, percent: Math.round(progress) }
                : f
            )
          );
        }
      }, 200);

      return false;
    },
  };

  const removeFile = (uid: string) => {
    setFiles((prev) => prev.filter((f) => f.uid !== uid));
  };

  const doneFiles = files.filter((f) => f.status === "done");
  const uploadingFiles = files.filter((f) => f.status === "uploading");

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: token.colorBgLayout,
        padding: "24px 16px",
      }}
    >
      {/* Header */}
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
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
            {...uploadProps}
            style={{
              borderRadius: 16,
              border: `2px dashed ${isDragging ? token.colorPrimary : token.colorBorderSecondary}`,
              background: isDragging
                ? `${token.colorPrimaryBg}`
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
                  style={{ transition: "all 0.2s ease" }}
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

        {/* Uploading files */}
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
                    percent={file.percent ?? 0}
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

        {/* Files list */}
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
                  {/* Icon */}
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

                  {/* Info */}
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

                  {/* Actions */}
                  <Space size={4}>
                    <Tooltip title="Copiar link">
                      <Button
                        type="text"
                        size="small"
                        icon={<Link2 size={14} />}
                        style={{ color: token.colorTextSecondary }}
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
