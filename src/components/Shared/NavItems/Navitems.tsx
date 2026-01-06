export interface NavItem {
  title: string;
  href: string;
  description?: string;
  subItems?: NavItem[];
  featured?: NavItem[];
}

export interface NavLink {
  label: string;
  href: string;
  subLinks?: NavLink[];
}

export const navItems: NavItem[] = [
  {
    title: "S K I N  C A R E",
    href: "/skin-care",
    subItems: [
      {
        title: "All Products",
        href: "/skin-care/all",
        description: "Browse our entire collection",
      },
      {
        title: "New Arrivals",
        href: "/skin-care/new",
        description: "Latest additions to our store",
      },
      {
        title: "Best Sellers",
        href: "/skin-care/best",
        description: "Most popular items",
      },
    ],
    featured: [
      {
        title: "Summer Collection",
        href: "/skin-care/collections/summer",
        description: "Light and breezy styles for warm days",
      },
      {
        title: "Winter Essentials",
        href: "/skin-care/collections/winter",
        description: "Stay warm with our premium collection",
      },
    ],
  },
  {
    title: "B A B Y  C A R E",
    href: "/baby-care",
    subItems: [
      {
        title: "Electronics",
        href: "/baby-care/electronics",
        subItems: [
          { title: "Smartphones", href: "/baby-care/electronics/phones" },
          { title: "Laptops", href: "/baby-care/electronics/laptops" },
          { title: "Accessories", href: "/baby-care/electronics/accessories" },
        ],
      },
      {
        title: "Fashion",
        href: "/baby-care/fashion",
        subItems: [
          { title: "Men's", href: "/baby-care/fashion/men" },
          { title: "Women's", href: "/baby-care/fashion/women" },
          { title: "Kids'", href: "/baby-care/fashion/kids" },
        ],
      },
      {
        title: "Home & Living",
        href: "/baby-care/home",
        subItems: [
          { title: "Furniture", href: "/baby-care/home/furniture" },
          { title: "Decor", href: "/baby-care/home/decor" },
          { title: "Kitchen", href: "/baby-care/home/kitchen" },
        ],
      },
    ],
  },
  {
    title: "M A K E  U P",
    href: "/make-up",
    subItems: [
      { title: "Flash Sales", href: "/make-up/flash" },
      { title: "Clearance", href: "/make-up/clearance" },
      { title: "Bundle Offers", href: "/make-up/bundles" },
    ],
  },
  {
    title: "U N D E R G A R M E N T S",
    href: "/undergarments",
    subItems: [
      { title: "Apple", href: "/undergarments/apple" },
      { title: "Samsung", href: "/undergarments/samsung" },
      { title: "Nike", href: "/undergarments/nike" },
      { title: "Adidas", href: "/undergarments/adidas" },
    ],
  },
];
