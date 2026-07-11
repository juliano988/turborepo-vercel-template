import { File, LayoutDashboard, Settings, User } from "@repo/ui";

export const menuRoutes = [
  {
    path: "/",
    name: "Dashboard",
    icon: <LayoutDashboard />,
  },
  {
    path: "/usuarios",
    name: "Usuarios",
    icon: <User />,
  },
  {
    path: "/conteudo",
    name: "Conteudo",
    icon: <File />,
  },
  {
    path: "/configuracoes",
    name: "Configuracoes",
    icon: <Settings />,
  },
];
