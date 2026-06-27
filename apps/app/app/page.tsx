"use client";

import { Flex, Typography } from "antd";

const { Title, Text } = Typography;

export default function Home() {
  return (
    <Flex align="center" justify="center" style={{ minHeight: "100vh" }}>
      <div style={{ textAlign: "center" }}>
        <Text
          type="secondary"
          style={{
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            fontSize: 12,
          }}
        >
          Template · App
        </Text>
        <Title style={{ margin: "12px 0 8px" }}>Sua aplicação</Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          Aqui vai o conteúdo autenticado. Feito para UX, sem compromisso com
          SEO.
        </Text>
      </div>
    </Flex>
  );
}
