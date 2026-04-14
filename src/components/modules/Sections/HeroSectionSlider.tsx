"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Section } from "@/types/section.interface";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

interface HeroSliderWrapperProps {
  section: Section;
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
  section,
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
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const images = section.images || [];

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    loop: true,
    slides: {
      perView: 1,
    },
    slideChanged(slider) {
      setCurrentIndex(slider.track.details.rel);
    },
    drag: true,
    // Add animation options for smoother transitions
    renderMode: "performance", // Use performance mode for smoother animations
    // move(slider) {
    //   // Optional: Add any custom move logic
    // },
    created(slider) {
      // Optional: Add any creation logic
    },
  });

  const nextSlide = useCallback(() => {
    instanceRef.current?.next();
  }, [instanceRef]);

  const prevSlide = useCallback(() => {
    instanceRef.current?.prev();
  }, [instanceRef]);

  const goToSlide = useCallback(
    (index: number) => {
      instanceRef.current?.moveToIdx(index);
    },
    [instanceRef],
  );

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || paused || images.length <= 1) return;

    const startAutoPlay = () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        nextSlide();
      }, autoPlayInterval);
    };

    startAutoPlay();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoPlay, paused, autoPlayInterval, nextSlide, images.length]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (images.length === 0) {
    return (
      <div
        className={`w-full bg-linear-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      style={{ height }}
      onMouseEnter={() => pauseOnHover && setPaused(true)}
      onMouseLeave={() => pauseOnHover && setPaused(false)}
    >
      {/* Keen-Slider Container */}
      <div ref={sliderRef} className="keen-slider h-full">
        {images.map((image, index) => (
          <div key={index} className="keen-slider__slide relative h-full">
            <Image
              src={image}
              alt={section.title || `Hero image ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
              sizes="100vw"
            />
          </div>
        ))}
      </div>

      {showNavigation && images.length > 1 && (
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

      {showDots && images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${currentIndex === index
                  ? "bg-white w-8 h-3"
                  : "bg-white/60 hover:bg-white/80 w-3 h-3"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium z-20">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
