"use client";

import { signOut, useSession } from "@repo/auth/client";
import { LogOut, Moon, Sun, useThemeAntd } from "@repo/ui";
import { Avatar, Dropdown, Flex, Switch, Typography } from "antd";
import { useRouter } from "next/navigation";

export default function UserFooter() {
  const { data: session } = useSession();
  const { isDark, toggle } = useThemeAntd();
  const router = useRouter();

  const name = session?.user?.name ?? "Usuário";
  const email = session?.user?.email ?? "";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleLogout = async () => {
    await signOut({ fetchOptions: { onSuccess: () => router.push("/") } });
  };

  return (
    <Dropdown
      trigger={["click"]}
      placement="rightBottom"
      menu={{
        items: [
          {
            key: "user-info",
            label: (
              <Flex vertical gap={0} style={{ padding: "4px 0" }}>
                <Typography.Text strong>{name}</Typography.Text>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  {email}
                </Typography.Text>
              </Flex>
            ),
            disabled: true,
          },
          { type: "divider" },
          {
            key: "theme",
            label: (
              <Flex justify="space-between" align="center" gap={8}>
                <Flex align="center" gap={8}>
                  {isDark ? <Moon size={14} /> : <Sun size={14} />}
                  <span>Tema escuro</span>
                </Flex>
                <Switch
                  size="small"
                  checked={isDark}
                  onClick={(_, e) => e.stopPropagation()}
                  onChange={toggle}
                />
              </Flex>
            ),
            onClick: () => toggle(),
          },
          { type: "divider" },
          {
            key: "logout",
            danger: true,
            icon: <LogOut size={14} />,
            label: "Sair",
            onClick: handleLogout,
          },
        ],
      }}
    >
      <Flex
        align="center"
        gap={10}
        style={{ padding: "12px 16px", cursor: "pointer" }}
      >
        <Avatar size={32} style={{ flexShrink: 0 }}>
          <div style={{ marginLeft: 10 }}>{initials}</div>
        </Avatar>
        <Flex vertical style={{ overflow: "hidden", flex: 1 }}>
          <Typography.Text
            strong
            ellipsis
            style={{ fontSize: 13, lineHeight: 1.3 }}
          >
            {name}
          </Typography.Text>
          <Typography.Text
            type="secondary"
            ellipsis
            style={{ fontSize: 11, lineHeight: 1.3 }}
          >
            {email}
          </Typography.Text>
        </Flex>
      </Flex>
    </Dropdown>
  );
}
