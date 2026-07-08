import { Progress, Space, theme, Typography } from "antd";
import { UPLOADING_LIST_LABELS, UPLOADING_LIST_SIZES } from "./constants";
import { formatBytes } from "../../modules/formatBytes";
import { getFileIcon } from "../../modules/getFileIcon";
import type { UploadingListProps } from "./types";

const { Text } = Typography;

export function UploadingList({ files, isPending }: UploadingListProps) {
  const { token } = theme.useToken();

  if (files.length === 0) {
    return null;
  }

  return (
    <div style={{ marginBottom: UPLOADING_LIST_SIZES.marginBottom }}>
      <Text
        type="secondary"
        style={{
          fontSize: UPLOADING_LIST_SIZES.sectionFontSize,
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          display: "block",
          marginBottom: UPLOADING_LIST_SIZES.sectionMarginBottom,
        }}
      >
        {UPLOADING_LIST_LABELS.section} ({files.length})
      </Text>
      <Space
        direction="vertical"
        style={{ width: "100%" }}
        size={UPLOADING_LIST_SIZES.listSpacing}
      >
        {files.map((file) => (
          <div
            key={file.uid}
            style={{
              background: token.colorBgContainer,
              borderRadius: 12,
              padding: UPLOADING_LIST_SIZES.itemPadding,
              border: `1px solid ${token.colorBorderSecondary}`,
            }}
          >
            <Space
              style={{
                width: "100%",
                marginBottom: UPLOADING_LIST_SIZES.rowMarginBottom,
              }}
            >
              <span style={{ color: token.colorPrimary }}>
                {getFileIcon(file.type)}
              </span>
              <Text
                style={{
                  fontSize: UPLOADING_LIST_SIZES.nameFontSize,
                  flex: 1,
                }}
                ellipsis
              >
                {file.name}
              </Text>
              <Text
                type="secondary"
                style={{ fontSize: UPLOADING_LIST_SIZES.metaFontSize }}
              >
                {formatBytes(file.size)}
              </Text>
            </Space>
            <Progress
              percent={
                isPending
                  ? UPLOADING_LIST_SIZES.progressPendingPercent
                  : UPLOADING_LIST_SIZES.progressDonePercent
              }
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
  );
}
