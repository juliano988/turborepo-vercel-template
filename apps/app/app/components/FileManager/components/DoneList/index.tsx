import { Link2, Trash2 } from "@repo/ui";
import { Button, Space, theme, Tooltip, Typography } from "antd";
import {
  DONE_LIST_LABELS,
  DONE_LIST_SIZES,
  DONE_LIST_TIME_FORMAT,
} from "./constants";
import { formatBytes } from "../../modules/formatBytes";
import { getFileColor } from "../../modules/getFileColor";
import { getFileIcon } from "../../modules/getFileIcon";
import type { DoneListProps } from "./types";

const { Text } = Typography;

export function DoneList({ files, onRemove, onCopyLink }: DoneListProps) {
  const { token } = theme.useToken();

  if (files.length === 0) {
    return null;
  }

  return (
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
          {DONE_LIST_LABELS.section} ({files.length})
        </Text>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {formatBytes(files.reduce((acc, f) => acc + f.size, 0))} total
        </Text>
      </div>
      <Space direction="vertical" style={{ width: "100%" }} size={6}>
        {files.map((file) => (
          <div
            key={file.uid}
            style={{
              background: token.colorBgContainer,
              borderRadius: 12,
              padding: "12px 16px",
              border: `1px solid ${token.colorBorderSecondary}`,
              display: "flex",
              alignItems: "center",
              gap: DONE_LIST_SIZES.itemGap,
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
                {file.uploadedAt.toLocaleTimeString(
                  "pt-BR",
                  DONE_LIST_TIME_FORMAT
                )}
              </Text>
            </div>

            <Space size={4}>
              <Tooltip title={DONE_LIST_LABELS.copyLink}>
                <Button
                  type="text"
                  size="small"
                  icon={<Link2 size={DONE_LIST_SIZES.actionIcon} />}
                  style={{ color: token.colorTextSecondary }}
                  onClick={() => onCopyLink(file.uid)}
                />
              </Tooltip>
              <Tooltip title={DONE_LIST_LABELS.remove}>
                <Button
                  type="text"
                  size="small"
                  danger
                  icon={<Trash2 size={DONE_LIST_SIZES.actionIcon} />}
                  onClick={() => onRemove(file.uid)}
                />
              </Tooltip>
            </Space>
          </div>
        ))}
      </Space>
    </div>
  );
}
