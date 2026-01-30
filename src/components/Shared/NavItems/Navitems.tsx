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
    title: "SKINCARE",
    href: "/categorys/skin-care",
    subItems: [
      {
        title: "All Products",
        href: "/categorys/skin-care",
        description: "Explore our full skincare range",
      },
      {
        title: "New Arrivals",
        href: "/categorys/new-arrivals",
        description: "Discover the latest in skincare",
      },
      {
        title: "Best Sellers",
        href: "/categorys/best-sellers",
        description: "Customer favorites and top-rated products",
      },
      {
        title: "Facewash",
        href: "/categorys/facewash",
      },
      {
        title: "Moisturizer",
        href: "/categorys/moisturizer",
      },
      {
        title: "Sunscreen",
        href: "/categorys/sunscreen",
      },
      {
        title: "Ampoule",
        href: "/categorys/ampoule",
      },
      {
        title: "Toner",
        href: "/categorys/toner",
      },
      {
        title: "Essence",
        href: "/categorys/essence",
      },
      {
        title: "Face Mask",
        href: "/categorys/face-mask",
      },
      {
        title: "Serum",
        href: "/categorys/serum",
      },
      {
        title: "Special Treatments",
        href: "/categorys/special-treatments",
      },
      {
        title: "Double Cleansing",
        href: "/categorys/double-cleansing",
      },
      {
        title: "Powder",
        href: "/categorys/powder",
      },
      {
        title: "Japanese",
        href: "/categorys/japanese",
      },
      {
        title: "Try & Glow",
        href: "/categorys/try-and-glow",
      },
      {
        title: "Skin Care Combo",
        href: "/categorys/skin-care-combo",
      },
    ],
    featured: [
      {
        title: "Hydration Heroes",
        href: "/categorys/hydration-heroes",
        description: "Keep your skin moisturized and glowing",
      },
      {
        title: "Acne Solutions",
        href: "/categorys/acne-solutions",
        description: "Effective treatments for clear skin",
      },
    ],
  },
  {
    title: "PERFUME",
    href: "/categorys/perfume",
    subItems: [
      {
        title: "All Products",
        href: "/categorys/perfume",
        description: "Browse our entire collection",
      },
      {
        title: "New Arrivals",
        href: "/categorys/new-arrivals",
        description: "Latest additions to our store",
      },
      {
        title: "Best Sellers",
        href: "/categorys/best-sellers",
        description: "Most popular items",
      },
    ],
    featured: [
      {
        title: "Summer Collection",
        href: "/categorys/summer-collection",
        description: "Light and breezy styles for warm days",
      },
      {
        title: "Winter Essentials",
        href: "/categorys/winter-essentials",
        description: "Stay warm with our premium collection",
      },
    ],
  },
  {
    title: "MOM & BABY",
    href: "/categorys/mom-baby",
    subItems: [
      { title: "Baby Care", href: "/categorys/baby-care" },
      { title: "Baby Lotion", href: "/categorys/baby-lotion" },
      {
        title: "Baby Conditioner",
        href: "/categorys/baby-conditioner",
      },
      { title: "Baby Oil", href: "/categorys/baby-oil" },
      { title: "Baby Wash", href: "/categorys/baby-wash" },
      { title: "Baby Soap", href: "/categorys/baby-soap" },
      {
        title: "Baby Wash & Shampoo",
        href: "/categorys/baby-wash-shampoo",
      },
      { title: "Baby Grooming", href: "/categorys/baby-grooming" },
      { title: "Feeding", href: "/categorys/feeding" },
    ],
  },
  {
    title: "HEALTH & BEAUTY",
    href: "/categorys/health-beauty",
    subItems: [
      {
        title: "Facewash",
        href: "/categorys/facewash",
      },
      {
        title: "Moisturizer",
        href: "/categorys/moisturizer",
      },
      {
        title: "Sunscreen",
        href: "/categorys/sunscreen",
      },
      {
        title: "Ampoule",
        href: "/categorys/ampoule",
      },
      {
        title: "Toner",
        href: "/categorys/toner",
      },
      {
        title: "Essence",
        href: "/categorys/essence",
      },
      {
        title: "Face Mask",
        href: "/categorys/face-mask",
      },
      {
        title: "Serum",
        href: "/categorys/serum",
      },
      {
        title: "Special Treatments",
        href: "/categorys/special-treatments",
      },
      {
        title: "Double Cleansing",
        href: "/categorys/double-cleansing",
      },
      {
        title: "Powder",
        href: "/categorys/powder",
      },
      {
        title: "Japanese",
        href: "/categorys/japanese",
      },
      {
        title: "Try & Glow",
        href: "/categorys/try-and-glow",
      },
      {
        title: "Skin Care Combo",
        href: "/categorys/skin-care-combo",
      },
      {
        title: "Blush",
        href: "/categorys/blush",
      },
      {
        title: "Highlighter",
        href: "/categorys/highlighter",
      },
      {
        title: "BB & CC Cream",
        href: "/categorys/bb-cc-cream",
      },
      {
        title: "Makeup Brush",
        href: "/categorys/makeup-brush",
      },
      {
        title: "Makeup Setting Spray",
        href: "/categorys/makeup-setting-spray",
      },
      {
        title: "Cosmetics Pads + Makeup Sponge",
        href: "/categorys/cosmetics-pads-makeup-sponge",
      },
      {
        title: "False Nail",
        href: "/categorys/false-nail",
      },
      {
        title: "Nail Polish",
        href: "/categorys/nail-polish",
      },
      {
        title: "Nail Polish Remover",
        href: "/categorys/nail-polish-remover",
      },
    ],
  },
  {
    title: "HAIR AND BEAUTY",
    href: "/categorys/hair-beauty",
    subItems: [
      { title: "Shampoo", href: "/categorys/shampoo" },
      { title: "Conditioner", href: "/categorys/conditioner" },
      { title: "Hair mask", href: "/categorys/hair-mask" },
      {
        title: "Leave in conditioner",
        href: "/categorys/leave-in-conditioner",
      },
      { title: "Hair Oil", href: "/categorys/hair-oil" },
      { title: "Hair Styling Tools", href: "/categorys/hair-styling-tools" },
      {
        title: "Hair Special Treatment",
        href: "/categorys/hair-special-treatment",
      },
      { title: "Hair Serum", href: "/categorys/hair-serum" },
      { title: "Hair Combo", href: "/categorys/hair-combo" },
    ],
  },
  {
    title: "COMBO",
    href: "/categorys/combo",
    subItems: [
      { title: "Skin Care Combo", href: "/categorys/skin-care-combo" },
      { title: "Hair Care Combo", href: "/categorys/hair-care-combo" },
      { title: "Makeup Combo", href: "/categorys/makeup-combo" },
      { title: "Mom & Baby Combo", href: "/categorys/mom-baby-combo" },
    ],
  },
  {
    title: "ACCESSORIES",
    href: "/categorys/accessories",
    subItems: [
      {
        title: "Skincare Tools",
        href: "/categorys/skincare-tools",
        description: "Tools for better skincare routines",
      },
      {
        title: "Makeup Tools",
        href: "/categorys/makeup-tools",
        description: "Brushes, sponges, and applicators",
      },
      {
        title: "Haircare Tools",
        href: "/categorys/haircare-tools",
        description: "Styling and haircare accessories",
      },
      {
        title: "Beauty Storage",
        href: "/categorys/beauty-storage",
        description: "Organizers and beauty cases",
      },
      {
        title: "Face Rollers & Gua Sha",
        href: "/categorys/face-rollers-gua-sha",
        description: "Massage tools for facial care",
      },
    ],
    featured: [
      {
        title: "K-Beauty Bestsellers",
        href: "/categorys/k-beauty-bestsellers",
        description: "Customer favorite Korean beauty accessories",
      },
      {
        title: "New K-Beauty Arrivals",
        href: "/categorys/new-k-beauty-arrivals",
        description: "Latest accessory trends from Korea",
      },
      {
        title: "Skincare Tool Kits",
        href: "/categorys/skincare-tool-kits",
        description: "Complete sets for skincare routines",
      },
      {
        title: "Makeup Brush Sets",
        href: "/categorys/makeup-brush-sets",
        description: "Professional brush collections",
      },
    ],
  },
  {
    title: "BRAND",
    href: "/categorys/brand",
    subItems: [
      { title: "Abib", href: "/categorys/abib" },
      { title: "Acwell", href: "/categorys/acwell" },
      { title: "Anua", href: "/categorys/anua" },
      { title: "APLB", href: "/categorys/aplb" },
      { title: "Aromatica", href: "/categorys/aromatica" },
      { title: "Axis-Y", href: "/categorys/axis-y" },
      { title: "Banila Co.", href: "/categorys/banila-co" },
      { title: "Beauty of Joseon", href: "/categorys/beauty-of-joseon" },
      { title: "Benton", href: "/categorys/benton" },
      { title: "Bonajour", href: "/categorys/bonajour" },
      { title: "Cos de Baha", href: "/categorys/cos-de-baha" },
      { title: "Torriden", href: "/categorys/torriden" },
      { title: "HaruHaru Wonder", href: "/categorys/haruharu-wonder" },
      { title: "Nineless", href: "/categorys/nineless" },
      { title: "A'PIEU", href: "/categorys/apieu" },
      { title: "Nacific", href: "/categorys/nacific" },
      { title: "Medicube", href: "/categorys/medicube" },
      { title: "Cosrx", href: "/categorys/cosrx" },
      { title: "Etude House", href: "/categorys/etude-house" },
      { title: "Heimish", href: "/categorys/heimish" },
      { title: "Innisfree", href: "/categorys/innisfree" },
      { title: "ISNTREE", href: "/categorys/isntree" },
      { title: "Illyoon", href: "/categorys/illyoon" },
      { title: "Iunik", href: "/categorys/iunik" },
      { title: "Jumiso", href: "/categorys/jumiso" },
      { title: "Pyunkang Yul", href: "/categorys/pyunkang-yul" },
      { title: "Goodal", href: "/categorys/goodal" },
      { title: "Dear Klairs", href: "/categorys/dear-klairs" },
      { title: "B.Lab", href: "/categorys/b-lab" },
      { title: "Skin Miso", href: "/categorys/skin-miso" },
      { title: "Dr. Ceuracle", href: "/categorys/dr-ceuracle" },
      { title: "Japanese Cosmetics", href: "/categorys/japanese-cosmetics" },
      { title: "VT", href: "/categorys/vt" },
      { title: "Laneige", href: "/categorys/laneige" },
      { title: "Missha", href: "/categorys/missha" },
      { title: "Mielle", href: "/categorys/mielle" },
      { title: "Neutrogena", href: "/categorys/neutrogena" },
      { title: "Numbuzin", href: "/categorys/numbuzin" },
      { title: "Panoxyl", href: "/categorys/panoxyl" },
      { title: "Paula's Choice", href: "/categorys/paulas-choice" },
      { title: "Purito", href: "/categorys/purito" },
      { title: "Round Lab", href: "/categorys/round-lab" },
      { title: "Karine", href: "/categorys/karine" },
      { title: "Be the Skin", href: "/categorys/be-the-skin" },
      { title: "Bioderma", href: "/categorys/bioderma" },
      { title: "Mary & May", href: "/categorys/mary-and-may" },
      { title: "The Derma Co", href: "/categorys/the-derma-co" },
      { title: "Simple", href: "/categorys/simple" },
      { title: "Dr.ForHair", href: "/categorys/dr-forhair" },
      { title: "Some By Mi", href: "/categorys/some-by-mi" },
      { title: "Skin1004", href: "/categorys/skin1004" },
      { title: "Tiam", href: "/categorys/tiam" },
      { title: "Tocobo", href: "/categorys/tocobo" },
      { title: "3w Clinic", href: "/categorys/3w-clinic" },
      { title: "The Face Shop", href: "/categorys/the-face-shop" },
      { title: "The Inkey List", href: "/categorys/the-inkey-list" },
      { title: "The Ordinary", href: "/categorys/the-ordinary" },
      { title: "Cera Ve", href: "/categorys/cera-ve" },
      { title: "Garnier", href: "/categorys/garnier" },
      { title: "I am From", href: "/categorys/i-am-from" },
      { title: "Belief", href: "/categorys/belief" },
      { title: "Mixsoon", href: "/categorys/mixsoon" },
      { title: "TIRTIR", href: "/categorys/tirtir" },
      { title: "Dr. Althea", href: "/categorys/dr-althea" },
    ],
  },
];
