"use client";

import { PageContainer, ProTable } from "@ant-design/pro-components";
import { Input, Select, Space, Tag, Typography } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { FileListItem, FilesFilterState, FilesListMeta } from "../../types";
import { formatBytes } from "./modules/formatBytes";
import { formatDate } from "./modules/formatDate";
import { updateQuery } from "./modules/updateQuery";

const { Link, Text } = Typography;

export function FilesTableClient({
  files,
  meta,
  filters,
}: {
  files: FileListItem[];
  meta: FilesListMeta;
  filters: FilesFilterState;
}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <PageContainer
      title="Arquivos"
      subTitle="Visao geral dos arquivos enviados no painel admin"
    >
      <Space orientation="vertical" size={20} style={{ width: "100%" }}>
        <ProTable<FileListItem>
          rowKey="id"
          search={false}
          cardBordered
          dataSource={files}
          toolbar={{
            search: (
              <Input.Search
                allowClear
                defaultValue={filters.search}
                placeholder="Buscar por nome ou MIME type"
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
                key="mimetype"
                style={{ width: 220 }}
                value={filters.mimeType || "all"}
                onChange={(value) =>
                  updateQuery({
                    pathname,
                    push: router.push,
                    meta,
                    filters,
                    next: {
                      page: 1,
                      mimeType: value === "all" ? "" : value,
                    },
                  })
                }
                options={[
                  { label: "Tipo: todos", value: "all" },
                  { label: "Imagem", value: "image/" },
                  { label: "Video", value: "video/" },
                  { label: "Audio", value: "audio/" },
                  { label: "PDF", value: "application/pdf" },
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
              title: "Nome",
              dataIndex: "name",
              width: 280,
              render: (_, record) => (
                <Space direction="vertical" size={0}>
                  <Text strong>{record.name}</Text>
                  <Text type="secondary">{record.id}</Text>
                </Space>
              ),
            },
            {
              title: "Tipo",
              dataIndex: "mimeType",
              width: 180,
              render: (_, record) => <Tag color="blue">{record.mimeType}</Tag>,
            },
            {
              title: "Tamanho",
              dataIndex: "sizeBytes",
              width: 120,
              align: "right",
              render: (_, record) => formatBytes(record.sizeBytes),
            },
            {
              title: "Owner",
              dataIndex: "ownerId",
              width: 220,
              render: (_, record) => <Text code>{record.ownerId}</Text>,
            },
            {
              title: "URL",
              dataIndex: "blobUrl",
              width: 220,
              ellipsis: true,
              render: (_, record) => (
                <Link href={record.blobUrl} target="_blank">
                  Abrir arquivo
                </Link>
              ),
            },
            {
              title: "Upload",
              dataIndex: "uploadedAt",
              width: 180,
              render: (_, record) => formatDate(record.uploadedAt),
            },
          ]}
        />
      </Space>
    </PageContainer>
  );
}
