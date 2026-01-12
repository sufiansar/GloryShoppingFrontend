import { NavSection } from "@/types/dashboard.section";
import { superAdminNavItems } from "./superAdminNavItems";
import { adminNavItems } from "./adminNavItems";
import { userNavItems } from "./userNavItems";

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
