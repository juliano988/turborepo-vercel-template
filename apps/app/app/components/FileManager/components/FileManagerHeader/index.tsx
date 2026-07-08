import { CloudUpload, ThemeToggleAntd } from "@repo/ui";
import { Space, theme, Typography } from "antd";
import {
  FILE_MANAGER_HEADER_LABELS,
  FILE_MANAGER_HEADER_SIZES,
} from "./constants";
import type { FileManagerHeaderProps } from "./types";

const { Text } = Typography;

export function FileManagerHeader(props: FileManagerHeaderProps) {
  void props;
  const { token } = theme.useToken();

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
      <ThemeToggleAntd />
    </div>
  );
}
