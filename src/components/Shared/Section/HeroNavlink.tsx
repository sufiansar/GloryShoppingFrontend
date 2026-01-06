import { ISection } from "@/types/Section.interface";
export interface HeroSliderProps {
  sections: ISection[];
  autoPlay?: boolean;
  delay?: number;
}

export const HeroSections: ISection[] = [
  {
    type: "HERO",
    title: "Summer Sale Collection",
    description: "Get up to 50% off on selected items. Limited time offer!",
    images: [
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&h=900&fit=crop",
    ],
    icons: "ShoppingBag",
    link: "/collections/summer-sale",
    ctaText: "Shop Now",
    isVisible: true,
    primaryColor: "#3B82F6",
    secondaryColor: "#1D4ED8",
  },
  {
    type: "NEW_ARRIVALS",
    title: "New Arrivals",
    description: "Discover the latest fashion trends for this season",
    images: [
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600&h=900&fit=crop",
    ],
    icons: "Tag",
    link: "/collections/new-arrivals",
    ctaText: "Explore",
    isVisible: true,
    primaryColor: "#EC4899",
    secondaryColor: "#BE185D",
  },
  {
    type: "BENEFITS",
    title: "Free Shipping Worldwide",
    description: "Enjoy free shipping on all orders above $50",
    images: [
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600&h=900&fit=crop",
    ],
    icons: "Truck",
    link: "/shipping-info",
    ctaText: "Learn More",
    isVisible: true,
    primaryColor: "#10B981",
    secondaryColor: "#047857",
  },
  {
    type: "PROMOTIONAL",
    title: "Secure Payment",
    description: "100% secure payment with money back guarantee",
    images: [
      "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=1600&h=900&fit=crop",
    ],
    icons: "Shield",
    link: "/payment-security",
    ctaText: "Shop Securely",
    isVisible: true,
    primaryColor: "#8B5CF6",
    secondaryColor: "#7C3AED",
  },
];
