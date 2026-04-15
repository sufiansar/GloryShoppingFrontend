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

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      initial: 0,
      loop: images.length > 1,
      slides: {
        perView: images.length > 1 ? 1.2 : 1,
        spacing: 4,
        origin: "center",
      },
      slideChanged(slider) {
        setCurrentIndex(slider.track.details.rel);
      },
      drag: true,
      renderMode: "performance",
    },
    [
      (slider) => {
        let timeout: NodeJS.Timeout;
        let mouseOver = false;
        function clearNextTimeout() {
          clearTimeout(timeout);
        }
        function nextTimeout() {
          clearTimeout(timeout);
          if (mouseOver) return;
          timeout = setTimeout(() => {
            slider.next();
          }, autoPlayInterval);
        }
        slider.on("created", () => {
          slider.container.addEventListener("mouseover", () => {
            mouseOver = true;
            clearNextTimeout();
          });
          slider.container.addEventListener("mouseout", () => {
            mouseOver = false;
            nextTimeout();
          });
          nextTimeout();
        });
        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);

        // Precision Active Class Plugin
        slider.on("created", () => {
          slider.slides[slider.track.details.rel].classList.add("is-active");
        });
        slider.on("detailsChanged", () => {
          slider.slides.forEach((slide) => slide.classList.remove("is-active"));
          slider.slides[slider.track.details.rel].classList.add("is-active");
        });
      },
    ]
  );

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
      {/* Global CSS for instantaneous shadow removal */}
      <style jsx global>{`
        .keen-slider__slide .active-overlay {
          opacity: 0.6;
          transition: opacity 0.3s ease;
        }
        .keen-slider__slide.is-active .active-overlay {
          opacity: 0 !important;
        }
        .keen-slider__slide.is-active > div {
          transform: scale(1) !important;
          opacity: 1 !important;
          filter: blur(0px) !important;
        }
      `}</style>
      
      {/* Keen-Slider Container */}
      <div 
        ref={sliderRef} 
        key={images.length}
        className="keen-slider h-full"
      >
        {images.map((image, index) => {
          const isActive = currentIndex === index;
          return (
            <div 
              key={index} 
              className={`keen-slider__slide relative h-full ${isActive ? 'is-active' : ''}`}
            >
              {/* Image Container with Shadow/Dim effect for inactive slides */}
              <div className={`relative h-full w-full transition-all duration-700 ease-in-out ${
                images.length > 1 
                  ? isActive 
                    ? "scale-100 z-10 shadow-2xl" 
                    : "scale-95 opacity-60 blur-[0.5px]" 
                  : ""
              }`}>
                <Image
                  src={image}
                  alt={section.title || `Hero image ${index + 1}`}
                  fill
                  className={`object-cover rounded-2xl`}
                  priority={index === 0}
                  sizes="100vw"
                />
                {/* Dim overlay for non-active slides - with active-overlay class for CSS control */}
                {images.length > 1 && (
                  <div className={`absolute inset-0 bg-black/50 rounded-2xl active-overlay transition-opacity duration-300 ${isActive ? 'opacity-0' : 'opacity-100'}`} />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showNavigation && images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            className="absolute left-[7%] top-1/2 -translate-y-1/2 bg-pink-200/90 hover:bg-pink-300 text-pink-700 p-4 rounded-full transition-all duration-300 z-30 shadow-md border-2 border-white flex items-center justify-center"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6 stroke-[3px]" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            className="absolute right-[7%] top-1/2 -translate-y-1/2 bg-pink-200/90 hover:bg-pink-300 text-pink-700 p-4 rounded-full transition-all duration-300 z-30 shadow-md border-2 border-white flex items-center justify-center"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6 stroke-[3px]" />
          </button>
        </>
      )}

      {showDots && images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${currentIndex === index
                  ? "bg-pink-500 w-10 h-3 shadow-sm"
                  : "bg-white/40 hover:bg-white/70 w-3 h-3"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-6 right-8 bg-pink-500/80 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-semibold z-20 border border-white/20">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
