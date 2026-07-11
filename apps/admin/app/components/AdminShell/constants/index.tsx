import { File, LayoutDashboard, Settings, User } from "@repo/ui";

export const menuRoutes = [
  {
    path: "/",
    name: "Dashboard",
    icon: <LayoutDashboard />,
  },
  {
    path: "/users",
    name: "Usuarios",
    icon: <User />,
  },
  {
    path: "/files",
    name: "Arquivos",
    icon: <File />,
  },
  {
    path: "/configuracoes",
    name: "Configuracoes",
    icon: <Settings />,
  },
];
