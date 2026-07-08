import { Trash2 } from "@repo/ui";
import { Button, Space, theme, Typography } from "antd";
import { ERROR_LIST_LABELS, ERROR_LIST_SIZES } from "./constants";
import { getFileIcon } from "../../modules/getFileIcon";
import type { ErrorListProps } from "./types";

const { Text } = Typography;

export function ErrorList({ files, onRemove }: ErrorListProps) {
  const { token } = theme.useToken();

  if (files.length === 0) {
    return null;
  }

  return (
    <div style={{ marginBottom: ERROR_LIST_SIZES.marginBottom }}>
      <Text
        type="danger"
        style={{
          fontSize: ERROR_LIST_SIZES.sectionFontSize,
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          display: "block",
          marginBottom: ERROR_LIST_SIZES.sectionMarginBottom,
        }}
      >
        {ERROR_LIST_LABELS.section} ({files.length})
      </Text>
      <Space
        direction="vertical"
        style={{ width: "100%" }}
        size={ERROR_LIST_SIZES.listSpacing}
      >
        {files.map((file) => (
          <div
            key={file.uid}
            style={{
              background: token.colorBgContainer,
              borderRadius: 12,
              padding: ERROR_LIST_SIZES.itemPadding,
              border: `1px solid ${token.colorErrorBorder}`,
              display: "flex",
              alignItems: "center",
              gap: ERROR_LIST_SIZES.itemGap,
            }}
          >
            <span style={{ color: token.colorError }}>
              {getFileIcon(file.type)}
            </span>
            <Text
              style={{ fontSize: ERROR_LIST_SIZES.nameFontSize, flex: 1 }}
              ellipsis
            >
              {file.name}
            </Text>
            <Button
              type="text"
              size="small"
              danger
              icon={<Trash2 size={ERROR_LIST_SIZES.actionIcon} />}
              onClick={() => onRemove(file.uid)}
            />
          </div>
        ))}
      </Space>
    </div>
  );
}
