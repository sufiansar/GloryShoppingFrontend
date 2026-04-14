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
    title: "HOME",
    href: "/",
  },
  // {
  //   title: "Skin Type",
  //   href: "/skin-type",
  //   subItems: [
  //     {
  //       title: "SKINCARE",
  //       href: "/categorys/skin-care",
  //     },
  //     {
  //       title: "skin concerns",
  //       href: "/categorys/skin-concerns",
  //     },
  //   ],
  // },
  {
    title: "SKINCARE",
    href: "/categorys/skin-care",
    subItems: [
      {
        title: "All Products",
        href: "/product",
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
        title: "Sheet Mask",
        href: "/categorys/sheet-mask",
      },
      {
        title: "Cleanser",
        href: "/categorys/cleanser",
      },

      {
        title: "Facial Cream",
        href: "/categorys/facial-cream",
      },
      {
        title: "Eye Cream",
        href: "/categorys/eye-cream",
      },
      {
        title: "Cream",
        href: "/categorys/cream",
      },
      {
        title: "Ampoule Serum",
        href: "/categorys/ampoule-serum",
      },
      {
        title: "Serum",
        href: "/categorys/serum"

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
        title: "All Skin Types",
        href: "/categorys/all-skin-types",
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
        href: "/categorys/product",
        description: "Browse our entire collection",
      },
      {
        title: "Men's Fashion",
        href: "/categorys/mens-fashion",
        description: "Latest additions to our store",
      },
      {
        title: "Women's Fashion",
        href: "/categorys/womens-fashion",
      },
      {
        title: "Unisex Perfume",
        href: "/categorys/unisex-perfume",

      }
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
      {
        title: "Baby Lotion",
        href: "/categorys/baby-lotion",
      },
      {
        title: "Baby Cream",
        href: "/categorys/baby-cream"
      },
      { title: "Baby Grooming", href: "/categorys/baby-grooming" },
      { title: "Feeding", href: "/categorys/feeding" },
    ],
  },
  {
    title: "SUPPLEMENT",
    href: "/categorys/supplement",
    subItems: [
      { title: "Mom's Health", href: "/categorys/moms-health" },
      {
        title: "Women's Health", href: "/categorys/womens-health"
      },
      {
        title: "Baby's Health", href: "/categorys/babys-health"
      },
      {
        title: "Adult's Health", href: "/categorys/adults-health"
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
      {
        title: "Hair Color",
        href: "/categorys/hair-color",
      },

      { title: "Hair Serum", href: "/categorys/hair-serum" },
      { title: "Hair Combo", href: "/categorys/hair-combo" },
    ],
  },
  {
    title: "SPECIAL",
    href: "/categorys/special",
    subItems: [
      { title: "Skin Care Special", href: "/categorys/skin-care-special" },
      { title: "Hair Care Special", href: "/categorys/hair-care-special" },
      { title: "Makeup Special", href: "/categorys/makeup-special" },
      { title: "Mom & Baby Special", href: "/categorys/mom-baby-special" },
      { title: "Perfume Special", href: "/categorys/perfume-special" },
      { title: "Supplement Special", href: "/categorys/supplement-special" },
      { title: "Hair and Beauty Special", href: "/categorys/hair-and-beauty-special" },
      { title: "Accessories Special", href: "/categorys/accessories-special" },
      { title: "Super Special", href: "/categorys/super-special" },
      { title: "Combo Special", href: "/categorys/combo-special" },

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
    featured: [
      {
        title: "K-Beauty Bestsellers",
        href: "/categorys/k-beauty-bestsellers",
        description: "Customer favorite Korean beauty accessories",
      },
      {
        title: "Lip balm",
        href: "/categorys/lip-balm",
        description: "Customer favorite Korean beauty accessories",
      },
      {
        title: "Lipstick",
        href: "/categorys/lipstick",
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
      { title: "Abib", href: "/categorys/brand/abib" },
      { title: "Acwell", href: "/categorys/brand/acwell" },
      { title: "Anua", href: "/categorys/brand/anua" },
      { title: "APLB", href: "/categorys/brand/aplb" },
      { title: "Aromatica", href: "/categorys/brand/aromatica" },
      { title: "Axis-Y", href: "/categorys/brand/axis-y" },
      { title: "Banila Co.", href: "/categorys/brand/banila-co" },
      { title: "Beauty of Joseon", href: "/categorys/brand/beauty-of-joseon" },
      { title: "Benton", href: "/categorys/brand/benton" },
      { title: "Bonajour", href: "/categorys/brand/bonajour" },
      { title: "Cos de Baha", href: "/categorys/brand/cos-de-baha" },
      { title: "Torriden", href: "/categorys/brand/torriden" },
      { title: "HaruHaru Wonder", href: "/categorys/brand/haruharu-wonder" },
      { title: "Nineless", href: "/categorys/brand/nineless" },
      { title: "A'PIEU", href: "/categorys/brand/apieu" },
      { title: "Nacific", href: "/categorys/brand/nacific" },
      { title: "Medicube", href: "/categorys/brand/medicube" },
      { title: "Cosrx", href: "/categorys/brand/cosrx" },
      { title: "Etude House", href: "/categorys/brand/etude-house" },
      { title: "Heimish", href: "/categorys/brand/heimish" },
      { title: "Innisfree", href: "/categorys/brand/innisfree" },
      { title: "ISNTREE", href: "/categorys/brand/isntree" },
      { title: "Illyoon", href: "/categorys/brand/illyoon" },
      { title: "Iunik", href: "/categorys/brand/iunik" },
      { title: "Jumiso", href: "/categorys/brand/jumiso" },
      { title: "Pyunkang Yul", href: "/categorys/brand/pyunkang-yul" },
      { title: "Goodal", href: "/categorys/brand/goodal" },
      { title: "Dear Klairs", href: "/categorys/brand/dear-klairs" },
      { title: "B.Lab", href: "/categorys/brand/b-lab" },
      { title: "Skin Miso", href: "/categorys/brand/skin-miso" },
      { title: "Dr. Ceuracle", href: "/categorys/brand/dr-ceuracle" },
      { title: "Japanese Cosmetics", href: "/categorys/brand/japanese-cosmetics" },
      { title: "VT", href: "/categorys/brand/vt" },
      { title: "Laneige", href: "/categorys/brand/laneige" },
      { title: "Missha", href: "/categorys/brand/missha" },
      { title: "Mielle", href: "/categorys/brand/mielle" },
      { title: "Neutrogena", href: "/categorys/brand/neutrogena" },
      { title: "Numbuzin", href: "/categorys/brand/numbuzin" },
      { title: "Panoxyl", href: "/categorys/brand/panoxyl" },
      { title: "Paula's Choice", href: "/categorys/brand/paulas-choice" },
      { title: "Purito", href: "/categorys/brand/purito" },
      { title: "Round Lab", href: "/categorys/brand/round-lab" },
      { title: "Karine", href: "/categorys/brand/karine" },
      { title: "Be the Skin", href: "/categorys/brand/be-the-skin" },
      { title: "Bioderma", href: "/categorys/brand/bioderma" },
      { title: "Mary & May", href: "/categorys/brand/mary-and-may" },
      { title: "The Derma Co", href: "/categorys/brand/the-derma-co" },
      { title: "Simple", href: "/categorys/brand/simple" },
      { title: "Dr.ForHair", href: "/categorys/brand/dr-forhair" },
      { title: "Some By Mi", href: "/categorys/brand/some-by-mi" },
      { title: "Skin1004", href: "/categorys/brand/skin1004" },
      { title: "Tiam", href: "/categorys/brand/tiam" },
      { title: "Tocobo", href: "/categorys/brand/tocobo" },
      { title: "3w Clinic", href: "/categorys/brand/3w-clinic" },
      { title: "The Face Shop", href: "/categorys/brand/the-face-shop" },
      { title: "The Inkey List", href: "/categorys/brand/the-inkey-list" },
      { title: "The Ordinary", href: "/categorys/brand/the-ordinary" },
      { title: "Cera Ve", href: "/categorys/brand/cera-ve" },
      { title: "Garnier", href: "/categorys/brand/garnier" },
      { title: "I am From", href: "/categorys/brand/i-am-from" },
      { title: "Belief", href: "/categorys/brand/belief" },
      { title: "Mixsoon", href: "/categorys/brand/mixsoon" },
      { title: "TIRTIR", href: "/categorys/brand/tirtir" },
      { title: "Dr. Althea", href: "/categorys/brand/dr-althea" },
    ],
  },
];
