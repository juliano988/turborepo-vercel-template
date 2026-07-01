"use client";

import { Flex, Typography } from "antd";
import { ThemeToggleAntd } from "@repo/ui";

const { Title, Text } = Typography;

export default function Home() {
  return (
    <>
      <div style={{ position: "fixed", top: 16, right: 16 }}>
        <ThemeToggleAntd />
      </div>
      <Flex align="center" justify="center" style={{ minHeight: "100dvh" }}>
        <div style={{ textAlign: "center", maxWidth: 448 }}>
          {/* text-sm font-medium tracking-widest uppercase opacity-50 */}
          <Text
            style={{
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              opacity: 0.5,
              display: "block",
            }}
          >
            Template · App
          </Text>

          {/* text-5xl font-bold tracking-tight */}
          <Title
            style={{
              fontSize: 48,
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
              margin: "16px 0 16px",
            }}
          >
            Sua aplicação
          </Title>

          {/* text-lg opacity-60 */}
          <Text
            style={{
              fontSize: 18,
              opacity: 0.6,
              display: "block",
            }}
          >
            Aqui vai o conteúdo autenticado. Feito para UX, sem compromisso com
            SEO.
          </Text>
        </div>
      </Flex>
    </>
  );
}
