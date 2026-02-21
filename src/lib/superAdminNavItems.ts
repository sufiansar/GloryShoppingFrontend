import { NavSection } from "@/types/dashboard.section";

export const superAdminNavItems: NavSection[] = [
  {
    title: "Creating Part",
    items: [
      {
        title: "Create Section",
        href: "/admin/dashboard/create-section",
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
        href: "/admin/dashboard/products/create",
        icon: "PackagePlus",
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        title: "Product Variant",
        href: "/admin/dashboard/variants/create",
        icon: "Package",
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      // {
      //   title: "Brands",
      //   href: "/admin/dashboard/brand/brand-management",
      //   icon: "Trademark",
      //   roles: ["SUPER_ADMIN", "ADMIN"],
      // },
      {
        title: "Product Ingredients",
        href: "/admin/dashboard/ingredients",
        icon: "Beaker",
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        title: "skin-management",
        href: "/admin/dashboard/skin-management",
        icon: "Skin",
        roles: ["SUPER_ADMIN", "ADMIN"],
      },

      {
        title: "Add Products to Skin Types",
        href: "/admin/dashboard/skin-management/add-products",
        icon: "Link",
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      // {
      //   title: "Skin Concerns",
      //   href: "/admin/dashboard/skin-concerns",
      //   icon: "HeartPulse",
      //   roles: ["SUPER_ADMIN", "ADMIN"],
      // },
      // {
      //   title: "Skin Types",
      //   href: "/admin/dashboard/skin-types",
      //   icon: "Droplet",
      //   roles: ["SUPER_ADMIN", "ADMIN"],
      // },
    ],
  },
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
        title: "Categories Management",
        href: "/admin/dashboard/categories-management",
        icon: "Tag",
        roles: ["SUPER_ADMIN"],
      },
      {
        title: "Brand Management",
        href: "/admin/dashboard/brand/brand-management",
        icon: "Beaker",
        roles: ["SUPER_ADMIN"],
      },
      {
        title: "Product Variants Management",
        href: "/admin/dashboard/variants",
        icon: "Package",
        roles: ["SUPER_ADMIN"],
      },
      {
        title: "Product Management",
        href: "/admin/dashboard/products",
        icon: "Package",
        roles: ["SUPER_ADMIN"],
      },
      {
        title: "Section Management",
        href: " /admin/dashboard/section-management",
        icon: "Layers",
        roles: ["SUPER_ADMIN", "ADMIN"],
      },

      {
        title: "Order Management",
        href: "/admin/dashboard/orders-management",
        icon: "ShoppingCart",
        roles: ["SUPER_ADMIN"],
      },
    ],
  },
];
