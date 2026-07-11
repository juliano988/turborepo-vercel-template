"use client";

import { Card, Space, Typography } from "antd";

const { Title, Text } = Typography;

export default function Page() {
  return (
    <Space orientation="vertical" size={24} style={{ display: "flex" }}>
      <Card variant="borderless">
        <Text
          style={{
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            opacity: 0.56,
            display: "block",
          }}
        >
          Template · Admin
        </Text>
        <Title level={2} style={{ margin: "12px 0 8px" }}>
          Base simples com menu lateral
        </Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          Estrutura inicial do painel administrativo. Por enquanto, o foco fica
          apenas no shell com navegacao lateral.
        </Text>
      </Card>
    </Space>
  );
}
