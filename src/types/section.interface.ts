// types/section.ts
export enum SECTION_TYPE {
  HERO = "HERO",
  PROMOTIONAL = "PROMOTIONAL",
  BENEFITS = "BENEFITS",
  NEW_ARRIVALS = "NEW_ARRIVALS",
}

export interface Section {
  id: string;
  type: SECTION_TYPE; // Required
  images: string[]; // Required
  title?: string; // Optional
  description?: string; // Optional
  icons?: string; // Optional
  link?: string; // Optional
  ctaText?: string; // Optional
  isVisible?: boolean; // Optional
  primaryColor?: string; // Optional
  secondaryColor?: string; // Optional
  createdAt: Date;
  updatedAt: Date;
}
