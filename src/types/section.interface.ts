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

export interface HeroSliderProps {
  /** Array of hero slides to display */
  slides: Section[];

  /** Enable automatic sliding */
  autoPlay?: boolean;

  /** Time between slides in milliseconds */
  autoPlayInterval?: number;

  /** Show navigation arrows */
  showNavigation?: boolean;

  /** Show pagination dots */
  showDots?: boolean;

  /** Pause on hover */
  pauseOnHover?: boolean;

  /** Animation duration in ms */
  animationDuration?: number;

  /** Container height */
  height?: string;

  /** Custom className */
  className?: string;

  /** Callback when slide changes */
  onSlideChange?: (index: number, slide: Section) => void;
}
