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
    title: "H O M E",
    href: "/",
  },

  {
    title: "PERFUME",
    href: "/perfume",
    subItems: [
      {
        title: "All Products",
        href: "/perfume/all",
        description: "Browse our entire collection",
      },
      {
        title: "New Arrivals",
        href: "/perfume/new",
        description: "Latest additions to our store",
      },
      {
        title: "Best Sellers",
        href: "/perfume/best",
        description: "Most popular items",
      },
    ],
    featured: [
      {
        title: "Summer Collection",
        href: "/perfume/collections/summer",
        description: "Light and breezy styles for warm days",
      },
      {
        title: "Winter Essentials",
        href: "/perfume/collections/winter",
        description: "Stay warm with our premium collection",
      },
    ],
  },
  {
    title: "MOM & BABY",
    href: "/mom-baby",
    subItems: [
      {
        title: "Electronics",
        href: "/mom-baby/electronics",
        subItems: [
          { title: "Smartphones", href: "/mom-baby/electronics/phones" },
          { title: "Laptops", href: "/mom-baby/electronics/laptops" },
          { title: "Accessories", href: "/mom-baby/electronics/accessories" },
        ],
      },
      {
        title: "Fashion",
        href: "/mom-baby/fashion",
        subItems: [
          { title: "Men's", href: "/mom-baby/fashion/men" },
          { title: "Women's", href: "/mom-baby/fashion/women" },
          { title: "Kids'", href: "/mom-baby/fashion/kids" },
        ],
      },
      {
        title: "Home & Living",
        href: "/mom-baby/home",
        subItems: [
          { title: "Furniture", href: "/mom-baby/home/furniture" },
          { title: "Decor", href: "/mom-baby/home/decor" },
          { title: "Kitchen", href: "/mom-baby/home/kitchen" },
        ],
      },
    ],
  },
  {
    title: "HEALTH & BEAUTY",
    href: "/health-beauty",
    subItems: [
      { title: "Flash Sales", href: "/health-beauty/flash" },
      { title: "Clearance", href: "/health-beauty/clearance" },
      { title: "Bundle Offers", href: "/health-beauty/bundles" },
    ],
  },
  {
    title: "FOOD & SUPPLEMENTS",
    href: "/food-supplements",
    subItems: [
      { title: "Apple", href: "/food-supplements/apple" },
      { title: "Samsung", href: "/food-supplements/samsung" },
      { title: "Nike", href: "/food-supplements/nike" },
      { title: "Adidas", href: "/food-supplements/adidas" },
    ],
  },
  {
    title: "COMBO",
    href: "/combo-packages",
    subItems: [
      { title: "Dell", href: "/combo-packages/dell" },
      { title: "HP", href: "/combo-packages/hp" },
      { title: "Lenovo", href: "/combo-packages/lenovo" },
    ],
  },
  {
    title: "K BEAUTY",
    href: "/k-beauty",
    subItems: [
      {
        title: "Skincare",
        href: "/k-beauty/skincare",
        description: "Top Korean skincare products",
      },
      {
        title: "Makeup",
        href: "/k-beauty/makeup",
        description: "Trendy Korean makeup items",
      },
      {
        title: "Haircare",
        href: "/k-beauty/haircare",
        description: "Premium haircare solutions",
      },
    ],
    featured: [
      {
        title: "K-Beauty Bestsellers",
        href: "/k-beauty/bestsellers",
        description: "Customer favorite Korean beauty products",
      },
      {
        title: "New K-Beauty Arrivals",
        href: "/k-beauty/new-arrivals",
        description: "Latest trends from Korea",
      },
    ],
  },
  {
    title: "BRAND",
    href: "/brand",
    subItems: [
      { title: "Abib", href: "/brand/abib" },
      { title: "Acwell", href: "/brand/acwell" },
      { title: "Anua", href: "/brand/anua" },
      { title: "APLB", href: "/brand/aplb" },
      { title: "Aromatica", href: "/brand/aromatica" },
      { title: "Axis-Y", href: "/brand/axis-y" },
      { title: "Banila Co.", href: "/brand/banila-co" },
      { title: "Beauty of Joseon", href: "/brand/beauty-of-joseon" },
      { title: "Benton", href: "/brand/benton" },
      { title: "Bonajour", href: "/brand/bonajour" },
      { title: "Cos de Baha", href: "/brand/cos-de-baha" },
      { title: "Torriden", href: "/brand/torriden" },
      { title: "HaruHaru Wonder", href: "/brand/haruharu-wonder" },
      { title: "Nineless", href: "/brand/nineless" },
      { title: "A'PIEU", href: "/brand/apieu" },
      { title: "Nacific", href: "/brand/nacific" },
      { title: "Medicube", href: "/brand/medicube" },
      { title: "Cosrx", href: "/brand/cosrx" },
      { title: "Etude House", href: "/brand/etude-house" },
      { title: "Heimish", href: "/brand/heimish" },
      { title: "Innisfree", href: "/brand/innisfree" },
      { title: "ISNTREE", href: "/brand/isntree" },
      { title: "Illyoon", href: "/brand/illyoon" },
      { title: "Iunik", href: "/brand/iunik" },
      { title: "Jumiso", href: "/brand/jumiso" },
      { title: "Pyunkang Yul", href: "/brand/pyunkang-yul" },
      { title: "Goodal", href: "/brand/goodal" },
      { title: "Dear Klairs", href: "/brand/dear-klairs" },
      { title: "B.Lab", href: "/brand/b-lab" },
      { title: "Skin Miso", href: "/brand/skin-miso" },
      { title: "Dr. Ceuracle", href: "/brand/dr-ceuracle" },
      { title: "Japanese Cosmetics", href: "/brand/japanese-cosmetics" },
      { title: "VT", href: "/brand/vt" },
      { title: "Laneige", href: "/brand/laneige" },
      { title: "Missha", href: "/brand/missha" },
      { title: "Mielle", href: "/brand/mielle" },
      { title: "Neutrogena", href: "/brand/neutrogena" },
      { title: "Numbuzin", href: "/brand/numbuzin" },
      { title: "Panoxyl", href: "/brand/panoxyl" },
      { title: "Paula's Choice", href: "/brand/paulas-choice" },
      { title: "Purito", href: "/brand/purito" },
      { title: "Round Lab", href: "/brand/round-lab" },
      { title: "Karine", href: "/brand/karine" },
      { title: "Be the Skin", href: "/brand/be-the-skin" },
      { title: "Bioderma", href: "/brand/bioderma" },
      { title: "Mary & May", href: "/brand/mary-and-may" },
      { title: "The Derma Co", href: "/brand/the-derma-co" },
      { title: "Simple", href: "/brand/simple" },
      { title: "Dr.ForHair", href: "/brand/dr-forhair" },
      { title: "Some By Mi", href: "/brand/some-by-mi" },
      { title: "Skin1004", href: "/brand/skin1004" },
      { title: "Tiam", href: "/brand/tiam" },
      { title: "Tocobo", href: "/brand/tocobo" },
      { title: "3w Clinic", href: "/brand/3w-clinic" },
      { title: "The Face Shop", href: "/brand/the-face-shop" },
      { title: "The Inkey List", href: "/brand/the-inkey-list" },
      { title: "The Ordinary", href: "/brand/the-ordinary" },
      { title: "Cera Ve", href: "/brand/cera-ve" },
      { title: "Garnier", href: "/brand/garnier" },
      { title: "I am From", href: "/brand/i-am-from" },
      { title: "Belief", href: "/brand/belief" },
      { title: "Mixsoon", href: "/brand/mixsoon" },
      { title: "TIRTIR", href: "/brand/tirtir" },
      { title: "Dr. Althea", href: "/brand/dr-althea" },
    ].map((item) => ({
      ...item,
      href: `/brand/${item.title.toLowerCase().replace(/\s+/g, "-").replace(/\./g, "")}`,
    })),
  },
];
