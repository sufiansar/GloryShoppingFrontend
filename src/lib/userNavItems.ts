import { NavSection } from "@/types/dashboard.section";

export const userNavItems: NavSection[] = [
  {
    title: "User",
    items: [
      {
        title: "My Products",
        href: "/dashboard/products",
        icon: "Activity",
        roles: ["USER"],
      },
    ],
  },
];
