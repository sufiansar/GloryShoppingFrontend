import { NavSection } from "@/types/dashboard.section";

export const superAdminNavItems: NavSection[] = [
  {
    title: "Super Admin",
    items: [
      {
        title: "User Management",
        href: "/admin/dashboard/users",
        icon: "Users",
        roles: ["SUPER_ADMIN"],
      },
      {
        title: "User Roles",
        href: "/admin/dashboard/roles",
        icon: "ShieldCheck",
        roles: ["SUPER_ADMIN"],
      },

      {
        title: "System Settings",
        href: "/admin/dashboard/settings",
        icon: "Settings",
        roles: ["SUPER_ADMIN"],
      },
    ],
  },
];
