"use client";

import { useState, useEffect, useCallback } from "react";
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
  showText?: boolean;
}

export default function HeroSliderWrapper({
  slides,
  autoPlay = true,
  autoPlayInterval = 5000,
  showNavigation = true,
  showDots = true,
  pauseOnHover = true,
  height = "400px",
  className = "",
  showText = false,
}: HeroSliderWrapperProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const validSlides = slides.filter(
    (slide) => slide.images && slide.images.length > 0 && slide.images[0],
  );

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % validSlides.length);
  }, [validSlides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + validSlides.length) % validSlides.length,
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
        className={`w-full bg-linear-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center ${className}`}
        style={{ height }}
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
      {/* Full-width Image */}
      <div className="absolute inset-0 transition-opacity duration-500">
        <Image
          src={currentImage}
          alt={currentSlide.title || "Hero image"}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>

      {showNavigation && validSlides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-sm p-3 rounded-full transition-all duration-300 z-20 shadow-lg"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6 text-gray-800" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-sm p-3 rounded-full transition-all duration-300 z-20 shadow-lg"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6 text-gray-800" />
          </button>
        </>
      )}

      {showDots && validSlides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {validSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                currentIndex === index
                  ? "bg-white w-8 h-3"
                  : "bg-white/60 hover:bg-white/80 w-3 h-3"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {validSlides.length > 1 && (
        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium z-20">
          {currentIndex + 1} / {validSlides.length}
        </div>
      )}
    </div>
  );
}
