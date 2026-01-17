"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import Image from "next/image";
import { HeroSliderProps } from "@/types/section.interface";

export default function HeroSlider({
  slides,
  autoPlay = true,
  autoPlayInterval = 5000,
  showNavigation = true,
  showDots = true,
  pauseOnHover = true,
  animationDuration = 500,
  height = "600px",
  className = "",
  onSlideChange,
}: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Filter only visible slides
  const visibleSlides = slides.filter((slide) => slide.isVisible);

  // Handle next slide
  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => {
      const nextIndex = (prev + 1) % visibleSlides.length;
      onSlideChange?.(nextIndex, visibleSlides[nextIndex]);
      return nextIndex;
    });
  }, [visibleSlides.length, onSlideChange]);

  // Handle previous slide
  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => {
      const prevIndex =
        (prev - 1 + visibleSlides.length) % visibleSlides.length;
      onSlideChange?.(prevIndex, visibleSlides[prevIndex]);
      return prevIndex;
    });
  }, [visibleSlides.length, onSlideChange]);

  // Handle dot click
  const goToSlide = useCallback(
    (index: number) => {
      setCurrentIndex(index);
      onSlideChange?.(index, visibleSlides[index]);
    },
    [visibleSlides, onSlideChange]
  );

  // Auto-play effect
  useEffect(() => {
    if (!autoPlay || isPaused || visibleSlides.length <= 1) return;

    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlay, isPaused, autoPlayInterval, nextSlide, visibleSlides.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevSlide, nextSlide]);

  // If no slides, show empty state
  if (visibleSlides.length === 0) {
    return (
      <div
        className={`w-full ${height} bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-xl ${className}`}
      >
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No slides available</p>
        </div>
      </div>
    );
  }

  const currentSlide = visibleSlides[currentIndex];

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl ${className}`}
      style={{ height }}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      {/* Current Slide */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: animationDuration / 1000 }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={currentSlide.images[0] || "/default-hero.jpg"}
              alt={currentSlide.title || "Hero slide"}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            {/* Gradient Overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: currentSlide.primaryColor
                  ? `linear-gradient(to right, ${
                      currentSlide.primaryColor
                    }40, ${
                      currentSlide.secondaryColor || currentSlide.primaryColor
                    }20)`
                  : "linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.3))",
              }}
            />
          </div>

          {/* Content */}
          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-4 md:px-8 lg:px-16">
              <div className="max-w-2xl">
                {/* Title */}
                {currentSlide.title && (
                  <motion.h1
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6"
                  >
                    {currentSlide.title}
                  </motion.h1>
                )}

                {/* Description */}
                {currentSlide.description && (
                  <motion.p
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-lg md:text-xl text-gray-200 mb-6 md:mb-8 max-w-lg"
                  >
                    {currentSlide.description}
                  </motion.p>
                )}

                {/* CTA Button */}
                {currentSlide.link && (
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <Button
                      size="lg"
                      className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                      asChild
                    >
                      <a href={currentSlide.link}>
                        {currentSlide.ctaText || "Shop Now"}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </a>
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows - Only show if more than 1 slide */}
      {showNavigation && visibleSlides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-full transition-all duration-300 z-20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-full transition-all duration-300 z-20"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-white" />
          </button>
        </>
      )}

      {/* Pagination Dots - Only show if more than 1 slide */}
      {showDots && visibleSlides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {visibleSlides.map((_, index) => (
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

      {/* Slide Counter */}
      {visibleSlides.length > 1 && (
        <div className="absolute bottom-6 right-6 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium z-20">
          {currentIndex + 1} / {visibleSlides.length}
        </div>
      )}
    </div>
  );
}
