


// export interface HeroSliderProps {
//   /** Array of hero items to display in the slider */
//   items: HeroItem[];

//   /** Enable automatic sliding */
//   autoPlay?: boolean;

//   /** Interval between slides in milliseconds (default: 5000ms) */
//   autoPlayInterval?: number;

//   /** Show navigation arrows */
//   showNavigation?: boolean;

//   /** Show dots/pagination indicators */
//   showDots?: boolean;

//   /** Show slide counter */
//   showCounter?: boolean;

//   /** Enable infinite looping */
//   infiniteLoop?: boolean;

//   /** Animation duration in milliseconds */
//   animationDuration?: number;

//   /** Animation type */
//   animationType?: "fade" | "slide" | "zoom" | "none";

//   /** Slide direction for animation */
//   slideDirection?: "horizontal" | "vertical";

//   /** Pause autoplay on hover */
//   pauseOnHover?: boolean;

//   /** Custom height for the slider */
//   height?: string | number;

//   /** Aspect ratio for responsive design */
//   aspectRatio?: string;

//   /** Overlay opacity (0-1) */
//   overlayOpacity?: number;

//   /** Overlay gradient direction */
//   gradientDirection?:
//     | "to right"
//     | "to left"
//     | "to bottom"
//     | "to top"
//     | "diagonal";

//   /** Custom CSS class for the slider container */
//   className?: string;

//   /** Custom CSS class for slide content */
//   contentClassName?: string;

//   /** Custom CSS class for navigation buttons */
//   navButtonClassName?: string;

//   /** Custom CSS class for dots */
//   dotsClassName?: string;

//   /** Custom styles for the slider container */
//   style?: React.CSSProperties;

//   /** Callback when slide changes */
//   onSlideChange?: (currentIndex: number, item: HeroItem) => void;

//   /** Callback when slider starts */
//   onPlay?: () => void;

//   /** Callback when slider pauses */
//   onPause?: () => void;

//   /** Custom navigation next button */
//   renderNextButton?: (
//     onClick: () => void,
//     disabled: boolean
//   ) => React.ReactNode;

//   /** Custom navigation previous button */
//   renderPrevButton?: (
//     onClick: () => void,
//     disabled: boolean
//   ) => React.ReactNode;

//   /** Custom dots/pagination component */
//   renderDots?: (
//     count: number,
//     activeIndex: number,
//     onClick: (index: number) => void
//   ) => React.ReactNode;

//   /** Custom counter component */
//   renderCounter?: (current: number, total: number) => React.ReactNode;

//   /** Custom loading component */
//   renderLoader?: () => React.ReactNode;

//   /** Custom error component */
//   renderError?: (error: Error) => React.ReactNode;

//   /** Custom empty state component */
//   renderEmpty?: () => React.ReactNode;

//   /** Custom slide content renderer */
//   renderSlideContent?: (item: HeroItem, isActive: boolean) => React.ReactNode;

//   /** Enable keyboard navigation */
//   keyboardNavigation?: boolean;

//   /** Enable swipe gestures on touch devices */
//   swipeable?: boolean;

//   /** Threshold for swipe detection (0-1) */
//   swipeThreshold?: number;

//   /** Show play/pause button */
//   showPlayPause?: boolean;

//   /** Custom play icon */
//   playIcon?: React.ReactNode;

//   /** Custom pause icon */
//   pauseIcon?: React.ReactNode;

//   /** Initial slide index */
//   initialSlide?: number;

//   /** Lazy load images */
//   lazyLoad?: boolean;

//   /** Preload adjacent slides */
//   preloadSlides?: number;

//   /** Enable RTL mode */
//   rtl?: boolean;

//   /** Accessibility labels */
//   ariaLabel?: string;
//   nextButtonAriaLabel?: string;
//   prevButtonAriaLabel?: string;
//   dotsAriaLabel?: string;

//   /** Data attributes for testing */
//   testId?: string;

//   /** Container element tag */
//   containerTag?: keyof jsx.IntrinsicElements;

//   /** Slide element tag */
//   slideTag?: keyof jsx.IntrinsicElements;
// }
