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
      {
        title: "Support",
        href: "/dashboard/support",
        icon: "LifeBuoy",
        roles: ["USER"],
      },
    ],
  },
];
