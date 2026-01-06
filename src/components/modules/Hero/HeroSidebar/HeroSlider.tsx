// components/hero-slider.tsx
"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import {
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Tag,
  Truck,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { ISection } from "@/types/Section.interface";
import { HeroSections } from "@/components/Shared/Section/HeroNavlink";

interface HeroSliderProps {
  sections: ISection[];
  autoPlay?: boolean;
  delay?: number;
}

const getIconComponent = (iconName?: string) => {
  switch (iconName) {
    case "ShoppingBag":
      return <ShoppingBag className="w-8 h-8" />;
    case "Tag":
      return <Tag className="w-8 h-8" />;
    case "Truck":
      return <Truck className="w-8 h-8" />;
    case "Shield":
      return <Shield className="w-8 h-8" />;
    default:
      return <ShoppingBag className="w-8 h-8" />;
  }
};

export function HeroSlider({
  sections = HeroSections,
  autoPlay = true,
  delay = 5000,
}: HeroSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);

  const visibleSections = sections.filter(
    (section) => section.isVisible !== false
  );

  const handleSlideChange = (swiper: any) => {
    setActiveIndex(swiper.activeIndex);
  };

  const goToSlide = (index: number) => {
    if (swiperInstance) {
      swiperInstance.slideTo(index);
    }
  };

  const goNext = () => {
    if (swiperInstance) {
      swiperInstance.slideNext();
    }
  };

  const goPrev = () => {
    if (swiperInstance) {
      swiperInstance.slidePrev();
    }
  };

  if (visibleSections.length === 0) {
    return (
      <div className="w-full h-125 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No slides available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-125 md:h-150 rounded-xl overflow-hidden group">
      <Swiper
        onSwiper={setSwiperInstance}
        onSlideChange={handleSlideChange}
        spaceBetween={0}
        centeredSlides={true}
        autoplay={
          autoPlay
            ? {
                delay: delay,
                disableOnInteraction: false,
              }
            : false
        }
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={false}
        modules={[Autoplay, Pagination, Navigation]}
        className="w-full h-full"
        loop={true}
      >
        {visibleSections.map((section, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-700"
                style={{
                  backgroundImage: `url(${
                    section.images[0] ||
                    "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&h=900&fit=crop"
                  })`,
                }}
              >
                {/* Overlay */}
                <div
                  className="absolute inset-0 opacity-50"
                  style={{
                    backgroundColor: section.primaryColor || "#000",
                    opacity: 0.3,
                  }}
                />
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex items-center">
                <div className="container mx-auto px-4 md:px-8">
                  <div className="max-w-2xl space-y-6">
                    {/* Icon */}
                    <div
                      className={cn(
                        "inline-flex items-center justify-center w-16 h-16 rounded-full mb-4",
                        "backdrop-blur-sm bg-white/20"
                      )}
                      style={{
                        backgroundColor: section.primaryColor
                          ? `${section.primaryColor}40`
                          : undefined,
                      }}
                    >
                      {getIconComponent(section.icons || undefined)}
                    </div>

                    {/* Title */}
                    <h1
                      className="text-4xl md:text-6xl font-bold text-white leading-tight"
                      style={{
                        textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                        color: section.secondaryColor || "#fff",
                      }}
                    >
                      {section.title}
                    </h1>

                    {/* Description */}
                    <p className="text-lg md:text-xl text-white/90 max-w-xl">
                      {section.description}
                    </p>

                    {/* CTA Button */}
                    {section.link && section.ctaText && (
                      <div className="pt-4">
                        <Button
                          size="lg"
                          className={cn(
                            "px-8 py-6 text-lg font-semibold rounded-full",
                            "transition-all duration-300 hover:scale-105",
                            "shadow-lg hover:shadow-xl"
                          )}
                          style={{
                            backgroundColor: section.primaryColor || "#3B82F6",
                            color: "#fff",
                          }}
                          onClick={() => (window.location.href = section.link!)}
                        >
                          {section.ctaText}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <button
        onClick={goPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 
                   rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center 
                   transition-all duration-300 hover:bg-white/30 opacity-0 group-hover:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      <button
        onClick={goNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 
                   rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center 
                   transition-all duration-300 hover:bg-white/30 opacity-0 group-hover:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Custom Pagination Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2">
        {visibleSections.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all duration-300",
              activeIndex === index ? "w-8" : ""
            )}
            style={{
              backgroundColor:
                activeIndex === index
                  ? visibleSections[activeIndex]?.primaryColor || "#fff"
                  : "rgba(255,255,255,0.5)",
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      {autoPlay && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
          <div
            className="h-full bg-white transition-all duration-300"
            style={{
              width: `${((activeIndex + 1) / visibleSections.length) * 100}%`,
              backgroundColor:
                visibleSections[activeIndex]?.primaryColor || "#fff",
            }}
          />
        </div>
      )}
    </div>
  );
}
