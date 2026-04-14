"use client";

import { useState } from "react";
import { skincareBrands } from "./utility/brandName";
import Link from "next/link";

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/\./g, "")
    .replace(/&/g, "and")
    .replace(/[^\w\-]+/g, "") // Remove non-word chars
    .replace(/\-\-+/g, "-")   // Replace multiple - with single -
    .trim();
};

export function SkincareMarquee() {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div className="w-full py-4 bg-linear-to-r from-[#ca428b] via-[#ca428b] to-[#ca428b] border-y border-[#b83a7d]/30 shadow-md">
      {/* Add CSS animation to global scope */}
      <style jsx global>{`
        @keyframes infiniteScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .marquee-wrapper {
          display: flex;
          width: max-content;
          white-space: nowrap;
        }
      `}</style>

      <div
        className="relative overflow-hidden cursor-pointer group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Gradient overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-[#ca428b] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-[#ca428b] to-transparent z-10 pointer-events-none" />

        {/* Single line marquee with proper animation */}
        <div
          className="marquee-wrapper py-3"
          style={{
            animation: `infiniteScroll 80s linear infinite`,
            animationPlayState: isPaused ? "paused" : "running",
          }}
        >
          {/* First set - Single line */}
          <div className="flex items-center gap-6 md:gap-8 px-4">
            {skincareBrands.map((brand, index) => (
              <Link
                key={`set1-${index}`}
                href={`/categorys/brand/${generateSlug(brand)}`}
                className="flex items-center gap-6 md:gap-8 shrink-0 hover:scale-110 transition-transform duration-200"
              >
                <span className="text-base md:text-lg font-bold text-white whitespace-nowrap drop-shadow-sm">
                  {brand}
                </span>
                <span className="text-lg text-white/70">•</span>
              </Link>
            ))}
          </div>

          {/* Duplicate set for infinite loop */}
          <div className="flex items-center gap-6 md:gap-8 px-4">
            {skincareBrands.map((brand, index) => (
              <Link
                key={`set2-${index}`}
                href={`/categorys/brand/${generateSlug(brand)}`}
                className="flex items-center gap-6 md:gap-8 shrink-0 hover:scale-110 transition-transform duration-200"
              >
                <span className="text-base md:text-lg font-bold text-white whitespace-nowrap drop-shadow-sm">
                  {brand}
                </span>
                <span className="text-lg text-white/70">•</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
