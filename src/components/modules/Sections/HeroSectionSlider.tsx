"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Section } from "@/types/section.interface";

interface HeroSliderWrapperProps {
  slides: Section[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showNavigation?: boolean;
  showDots?: boolean;
  pauseOnHover?: boolean;
  height?: string;
  className?: string;
  showText?: boolean; // New prop to control text display
}

export default function HeroSliderWrapper({
  slides,
  autoPlay = true,
  autoPlayInterval = 6000,
  showNavigation = true,
  showDots = true,
  pauseOnHover = true,
  height = "400px",
  className = "",
  showText = false, // Default to not showing text
}: HeroSliderWrapperProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Filter slides that have images
  const validSlides = slides.filter(
    (slide) => slide.images && slide.images.length > 0 && slide.images[0] // Ensure first image exists
  );

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % validSlides.length);
  }, [validSlides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + validSlides.length) % validSlides.length
    );
  }, [validSlides.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (!autoPlay || isPaused || validSlides.length <= 1) return;

    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlay, isPaused, autoPlayInterval, nextSlide, validSlides.length]);

  if (validSlides.length === 0) {
    return (
      <div
        className={`w-full ${height} bg-linear-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center ${className}`}
      >
        <p className="text-gray-500">No slides available</p>
      </div>
    );
  }

  const currentSlide = validSlides[currentIndex];
  const currentImage = currentSlide.images[0];

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl ${className}`}
      style={{ height }}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {/* Image Only - No overlay, no text */}
          <Image
            src={currentImage}
            alt={currentSlide.title || "Hero image"}
            fill
            className="object-cover"
            priority={currentIndex === 0}
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows - Only show if more than 1 slide */}
      {showNavigation && validSlides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 backdrop-blur-sm p-2 rounded-full transition-all duration-300 z-20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 backdrop-blur-sm p-2 rounded-full transition-all duration-300 z-20"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5 text-white" />
          </button>
        </>
      )}

      {/* Pagination Dots - Only show if more than 1 slide */}
      {showDots && validSlides.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {validSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-white w-6"
                  : "bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Slide Counter (optional) */}
      {validSlides.length > 1 && (
        <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium z-20">
          {currentIndex + 1} / {validSlides.length}
        </div>
      )}
    </div>
  );
}
