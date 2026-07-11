import {
  DashboardOutlined,
  FileTextOutlined,
  SettingOutlined,
  UserOutlined,
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
    icon: <FileTextOutlined />,
  },
  {
    path: "/configuracoes",
    name: "Configuracoes",
    icon: <SettingOutlined />,
  },
];
