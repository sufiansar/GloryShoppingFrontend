export interface ISection {
  type?: "HERO" | "PROMOTIONAL" | "BENEFITS" | "NEW_ARRIVALS" | null;
  title?: string | null;
  description?: string | null;
  images: string[];
  icons?: string | null;
  link?: string | null;
  ctaText?: string | null;
  isVisible?: boolean | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
}
