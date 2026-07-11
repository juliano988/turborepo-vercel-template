import {
  DashboardOutlined,
  FileOutlined,
  SettingOutlined,
  UserOutlined
} from "@ant-design/icons";

export const menuRoutes = [
  {
    path: "/",
    name: "Dashboard",
    icon: <DashboardOutlined />,
  },
  {
    path: "/usuarios",
    name: "Usuarios",
    icon: <UserOutlined />,
  },
  {
    path: "/conteudo",
    name: "Conteudo",
    icon: <FileOutlined />,
  },
  {
    path: "/configuracoes",
    name: "Configuracoes",
    icon: <SettingOutlined />,
  },
];
