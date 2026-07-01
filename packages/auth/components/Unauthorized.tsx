"use client";

import { Button, Flex, Result } from "antd";

interface UnauthorizedProps {
  loginUrl?: string;
}

export function Unauthorized({ loginUrl = "/login" }: UnauthorizedProps) {
  return (
    <Flex align="center" justify="center" style={{ minHeight: "100vh" }}>
      <Result
        status="403"
        title="Sem autorização"
        subTitle="Você não tem permissão para acessar esta página. Faça login para continuar."
        extra={
          <Button type="primary" href={loginUrl}>
            Ir para o login
          </Button>
        }
      />
    </Flex>
  );
}
