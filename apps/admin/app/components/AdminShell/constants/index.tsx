import { FileText, LayoutDashboard, Settings, Users } from "@repo/ui";

export const menuRoutes = [
  {
    path: "/",
    name: "Dashboard",
    icon: <LayoutDashboard size={16} />,
  },
  {
    path: "/usuarios",
    name: "Usuarios",
    icon: <Users size={16} />,
  },
  {
    path: "/conteudo",
    name: "Conteudo",
    icon: <FileText size={16} />,
  },
  {
    path: "/configuracoes",
    name: "Configuracoes",
    icon: <Settings size={16} />,
  },
];
