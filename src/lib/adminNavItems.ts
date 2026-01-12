import { NavSection } from "@/types/dashboard.section";

export const adminNavItems: NavSection[] = [
  {
    title: "Admin",
    items: [
      {
        title: "User Management",
        href: "/admin/dashboard/users",
        icon: "Users",
        roles: ["SUPER_ADMIN"],
      },
      {
        title: "Reviews",
        href: "/admin/dashboard/reviews",
        icon: "BarChart",
        roles: ["ADMIN"],
      },
    ],
  },
];
