"use client";

import { PageContainer, ProTable } from "@ant-design/pro-components";
import { Avatar, Badge, Input, Select, Space, Tag, Typography } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { UserListItem, UsersFilterState, UsersListMeta } from "../../types";
import { formatDate } from "./modules/formatDate";
import { initials } from "./modules/initials";
import { updateQuery } from "./modules/updateQuery";

const { Text } = Typography;

export function UsersTableClient({
  users,
  meta,
  filters,
}: {
  users: UserListItem[];
  meta: UsersListMeta;
  filters: UsersFilterState;
}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <PageContainer
      title="Usuarios"
      subTitle="Visao geral de contas cadastradas no painel admin"
    >
      <Space orientation="vertical" size={20} style={{ width: "100%" }}>
        <ProTable<UserListItem>
          rowKey="id"
          search={false}
          cardBordered
          dataSource={users}
          toolbar={{
            search: (
              <Input.Search
                allowClear
                defaultValue={filters.search}
                placeholder="Buscar por nome ou email"
                style={{ width: 280 }}
                onSearch={(value) =>
                  updateQuery({
                    pathname,
                    push: router.push,
                    meta,
                    filters,
                    next: {
                      page: 1,
                      search: value.trim(),
                    },
                  })
                }
              />
            ),
            actions: [
              <Select
                key="role"
                style={{ width: 160 }}
                value={filters.role || "all"}
                onChange={(value) =>
                  updateQuery({
                    pathname,
                    push: router.push,
                    meta,
                    filters,
                    next: {
                      page: 1,
                      role: value === "all" ? "" : value,
                    },
                  })
                }
                options={[
                  { label: "Roles: todas", value: "all" },
                  { label: "Administrador", value: "admin" },
                  { label: "Usuário", value: "user" },
                ]}
              />,
              <Select
                key="verified"
                style={{ width: 170 }}
                value={filters.emailVerified}
                onChange={(value) =>
                  updateQuery({
                    pathname,
                    push: router.push,
                    meta,
                    filters,
                    next: { page: 1, emailVerified: value },
                  })
                }
                options={[
                  { label: "Email: todos", value: "all" },
                  { label: "Verificado", value: "true" },
                  { label: "Pendente", value: "false" },
                ]}
              />,
              <Select
                key="status"
                style={{ width: 170 }}
                value={filters.banned}
                onChange={(value) =>
                  updateQuery({
                    pathname,
                    push: router.push,
                    meta,
                    filters,
                    next: { page: 1, banned: value },
                  })
                }
                options={[
                  { label: "Status: todos", value: "all" },
                  { label: "Ativo", value: "false" },
                  { label: "Bloqueado", value: "true" },
                ]}
              />,
            ],
          }}
          pagination={{
            current: meta.page,
            pageSize: meta.pageSize,
            total: meta.total,
            showSizeChanger: true,
            onChange: (current, pageSize) => {
              updateQuery({
                pathname,
                push: router.push,
                meta,
                filters,
                next: { page: current, pageSize },
              });
            },
          }}
          dateFormatter="string"
          options={false}
          columns={[
            {
              title: "Usuario",
              dataIndex: "name",
              width: 280,
              render: (_, record) => (
                <Space>
                  <Avatar src={record.image ?? undefined}>
                    {initials(record.name)}
                  </Avatar>
                  <Space orientation="vertical" size={0}>
                    <Text strong>{record.name}</Text>
                    <Text type="secondary">{record.email}</Text>
                  </Space>
                </Space>
              ),
            },
            {
              title: "Email",
              dataIndex: "emailVerified",
              width: 180,
              align: "center",
              render: (_, record) =>
                record.emailVerified ? (
                  <Badge status="success" text="Verificado" />
                ) : (
                  <Badge status="warning" text="Pendente" />
                ),
            },
            {
              title: "Role",
              dataIndex: "role",
              width: 140,
              align: "center",
              render: (_, record) => (
                <Tag color={record.role ? "blue" : "default"}>
                  {(record.role ?? "sem role").toUpperCase()}
                </Tag>
              ),
            },
            {
              title: "Status",
              dataIndex: "banned",
              width: 140,
              align: "center",
              render: (_, record) =>
                record.banned ? (
                  <Tag color="red">Bloqueado</Tag>
                ) : (
                  <Tag color="green">Ativo</Tag>
                ),
            },
            {
              title: "Criado em",
              dataIndex: "createdAt",
              width: 180,
              render: (_, record) => formatDate(record.createdAt),
            },
            {
              title: "Atualizado em",
              dataIndex: "updatedAt",
              width: 180,
              render: (_, record) => formatDate(record.updatedAt),
            },
          ]}
        />
      </Space>
    </PageContainer>
  );
}
