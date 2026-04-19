import { NavSection } from "@/types/dashboard.section";

export const userNavItems: NavSection[] = [
  {
    title: "User",
    items: [
      {
        title: "My Dashboard",
        href: "/dashboard/user",
        icon: "LayoutDashboard",
        roles: ["USER"],
      },
      {
        title: "My Orders",
        href: "/dashboard/user/orders",
        icon: "ShoppingBag",
        roles: ["USER"],
      },
    ],
  },
];
