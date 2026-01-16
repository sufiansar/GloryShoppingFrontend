import { NavSection } from "@/types/dashboard.section";

export const adminNavItems: NavSection[] = [
  {
    title: "Creating Part",
    items: [
      {
        title: "Create Section",
        href: "/admin/dashboard/sections",
        icon: "FolderPlus",
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        title: "Create Category",
        href: "/admin/dashboard/categories",
        icon: "Tag",
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        title: "Create Product",
        href: "/admin/dashboard/products",
        icon: "PackagePlus",
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        title: "Product Variant",
        href: "/admin/dashboard/product-variants",
        icon: "BoxMultiple",
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        title: "Brands",
        href: "/admin/dashboard/brands",
        icon: "Trademark",
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        title: "Product Ingredients",
        href: "/admin/dashboard/ingredients",
        icon: "Beaker",
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        title: "Skin Concerns",
        href: "/admin/dashboard/skin-concerns",
        icon: "HeartPulse",
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        title: "Skin Types",
        href: "/admin/dashboard/skin-types",
        icon: "Droplet",
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
    ],
  },
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
