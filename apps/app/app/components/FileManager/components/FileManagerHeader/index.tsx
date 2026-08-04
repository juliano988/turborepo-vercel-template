"use client";

import { signOut, useSession } from "@repo/auth/client";
import { CloudUpload, CopyIcon, ThemeToggleAntd } from "@repo/ui";
import { Button, Space, theme, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCurrentApiKeyAction } from "../../../../functions/getCurrentApiKeyAction";
import {
  FILE_MANAGER_HEADER_LABELS,
  FILE_MANAGER_HEADER_SIZES,
} from "./constants";
import type { FileManagerHeaderProps } from "./types";

const { Text } = Typography;

export function FileManagerHeader(props: FileManagerHeaderProps) {
  void props;
  const { token } = theme.useToken();
  const { data: session } = useSession();
  const router = useRouter();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const name = session?.user?.name ?? "Usuário";
  const email = session?.user?.email ?? "";

  useEffect(() => {
    void (async () => {
      const key = await getCurrentApiKeyAction();
      setApiKey(key);
    })();
  }, []);

  const handleCopyApiKey = async () => {
    if (!apiKey) {
      return;
    }

    await navigator.clipboard.writeText(apiKey);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = async () => {
    await signOut({ fetchOptions: { onSuccess: () => router.push("/") } });
  };

  return (
    <div
      style={{
        maxWidth: FILE_MANAGER_HEADER_SIZES.maxWidth,
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: FILE_MANAGER_HEADER_SIZES.paddingTop,
        marginBottom: FILE_MANAGER_HEADER_SIZES.marginBottom,
      }}
    >
      <Space align="center" size={FILE_MANAGER_HEADER_SIZES.gap}>
        <div
          style={{
            width: FILE_MANAGER_HEADER_SIZES.logoBoxSize,
            height: FILE_MANAGER_HEADER_SIZES.logoBoxSize,
            borderRadius: FILE_MANAGER_HEADER_SIZES.logoBorderRadius,
            background: token.colorPrimary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CloudUpload
            size={FILE_MANAGER_HEADER_SIZES.logoIconSize}
            color="#fff"
          />
        </div>
        <div>
          <Text
            strong
            style={{
              display: "block",
              fontSize: FILE_MANAGER_HEADER_SIZES.titleFontSize,
              lineHeight: FILE_MANAGER_HEADER_SIZES.titleLineHeight,
            }}
          >
            {FILE_MANAGER_HEADER_LABELS.title}
          </Text>
          <Text
            type="secondary"
            style={{
              fontSize: FILE_MANAGER_HEADER_SIZES.subtitleFontSize,
              lineHeight: FILE_MANAGER_HEADER_SIZES.subtitleLineHeight,
            }}
          >
            {FILE_MANAGER_HEADER_LABELS.subtitle}
          </Text>
        </div>
      </Space>
      <Space align="center" size={8}>
        <div
          style={{
            textAlign: "right",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <Text strong style={{ display: "block", lineHeight: 1.2 }}>
            {name}
          </Text>
          {email ? (
            <Text type="secondary" style={{ fontSize: 12, lineHeight: 1.2 }}>
              {email}
            </Text>
          ) : null}
          {apiKey ? (
            <Button
              type="text"
              size="small"
              icon={<CopyIcon size={10} />}
              onClick={handleCopyApiKey}
              style={{ padding: 0, height: "auto", fontSize: 12 }}
            >
              {copied ? "Copiada" : "Copiar API key"}
            </Button>
          ) : null}
        </div>
        <ThemeToggleAntd />
        <Button type="default" danger onClick={handleLogout}>
          Sair
        </Button>
      </Space>
    </div>
  );
}
