import { NavSection } from "@/types/dashboard.section";

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "USER";

export const commonNavItems = (role: UserRole): NavSection[] => {
  const items = [
    {
      title: "Dashboard",
      items: [
        {
          title: "Home",
          href: "/dashboard",
          icon: "LayoutDashboard",
          roles: ["SUPER_ADMIN", "ADMIN", "USER"] as UserRole[],
        },
        {
          title: "Profile",
          href: "/profile",
          icon: "UserCircle",
          roles: ["SUPER_ADMIN", "ADMIN", "USER"] as UserRole[],
        },
        {
          title: "Change Password",
          href: "/change-password",
          icon: "Lock",
          roles: ["SUPER_ADMIN", "ADMIN", "USER"] as UserRole[],
        },
        {
          title: "Homepage",
          href: "/",
          icon: "Home",
          roles: ["SUPER_ADMIN", "ADMIN", "USER"] as UserRole[],
        },
      ],
    },
  ];
  return items;
};

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

export const getNavItemsByRole = (role: UserRole): NavSection[] => {
  const commonItems = commonNavItems(role);

  switch (role) {
    case "SUPER_ADMIN":
      return [...commonItems, ...superAdminNavItems];
    case "ADMIN":
      return [...commonItems, ...adminNavItems];
    case "USER":
      return [...commonItems, ...userNavItems];
    default:
      return commonItems;
  }
};
