import { Inbox } from "@repo/ui";
import { Space, Tag, theme, Typography, Upload } from "antd";
import { UPLOAD_ZONE_LABELS, UPLOAD_ZONE_SIZES } from "./constants";
import type { UploadZoneProps } from "./types";

const { Text, Title } = Typography;
const { Dragger } = Upload;

export function UploadZone({
  isDragging,
  onDragEnter,
  onDragLeave,
  onDrop,
  onBeforeUpload,
}: UploadZoneProps) {
  const { token } = theme.useToken();

  return (
    <div
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      style={{ marginBottom: UPLOAD_ZONE_SIZES.marginBottom }}
    >
      <Dragger
        multiple
        showUploadList={false}
        beforeUpload={onBeforeUpload}
        style={{
          borderRadius: 16,
          border: `2px dashed ${isDragging ? token.colorPrimary : token.colorBorderSecondary}`,
          background: isDragging
            ? token.colorPrimaryBg
            : token.colorBgContainer,
          transition: "all 0.2s ease",
          padding: UPLOAD_ZONE_SIZES.outerPadding,
        }}
      >
        <div style={{ padding: UPLOAD_ZONE_SIZES.innerPadding }}>
          <div
            style={{
              width: UPLOAD_ZONE_SIZES.iconBoxSize,
              height: UPLOAD_ZONE_SIZES.iconBoxSize,
              borderRadius: UPLOAD_ZONE_SIZES.iconBorderRadius,
              background: isDragging
                ? token.colorPrimary
                : token.colorFillSecondary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: `0 auto ${UPLOAD_ZONE_SIZES.iconMarginBottom}px`,
              transition: "all 0.2s ease",
            }}
          >
            <Inbox
              size={UPLOAD_ZONE_SIZES.iconSize}
              color={isDragging ? "#fff" : token.colorPrimary}
            />
          </div>
          <Title level={4} style={{ margin: "0 0 8px", fontWeight: 600 }}>
            {UPLOAD_ZONE_LABELS.title}
          </Title>
          <Text type="secondary" style={{ fontSize: 14 }}>
            {UPLOAD_ZONE_LABELS.subtitlePrefix}{" "}
            <Text style={{ color: token.colorPrimary, fontWeight: 500 }}>
              {UPLOAD_ZONE_LABELS.select}
            </Text>{" "}
            {UPLOAD_ZONE_LABELS.subtitleSuffix}
          </Text>
          <div style={{ marginTop: 16 }}>
            <Space size={8} wrap style={{ justifyContent: "center" }}>
              {UPLOAD_ZONE_LABELS.tags.map((label) => (
                <Tag
                  key={label}
                  style={{
                    borderRadius: UPLOAD_ZONE_SIZES.tagBorderRadius,
                    fontSize: UPLOAD_ZONE_SIZES.tagFontSize,
                    padding: UPLOAD_ZONE_SIZES.tagPadding,
                    border: `1px solid ${token.colorBorderSecondary}`,
                    background: token.colorFillQuaternary,
                  }}
                >
                  {label}
                </Tag>
              ))}
            </Space>
          </div>
        </div>
      </Dragger>
    </div>
  );
}
