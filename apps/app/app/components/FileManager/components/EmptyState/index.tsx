import { Typography } from "antd";
import { EMPTY_STATE_LABELS, EMPTY_STATE_SIZES } from "./constants";
import type { EmptyStateProps } from "./types";

const { Text } = Typography;

export function EmptyState(props: EmptyStateProps) {
  void props;
  return (
    <div style={{ textAlign: "center", padding: EMPTY_STATE_SIZES.padding }}>
      <Text type="secondary" style={{ fontSize: EMPTY_STATE_SIZES.fontSize }}>
        {EMPTY_STATE_LABELS.message}
      </Text>
    </div>
  );
}
