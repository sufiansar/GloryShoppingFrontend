"use client";

import { useState } from "react";
import { skincareBrands } from "./utility/brandName";

export function SkincareMarquee() {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div className="w-full py-4 bg-pink-400 border-y my-4 border-border/50">
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
        <div className="absolute left-0 top-0 bottom-0 w-24  z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24  to-transparent z-10 pointer-events-none" />

        {/* Single line marquee with proper animation */}
        <div
          className="marquee-wrapper py-2"
          style={{
            animation: `infiniteScroll 80s linear infinite`,
            animationPlayState: isPaused ? "paused" : "running",
          }}
        >
          {/* First set - Single line */}
          <div className="flex items-center gap-6 md:gap-8 px-2">
            {skincareBrands.map((brand, index) => (
              <div
                key={`set1-${index}`}
                className="flex items-center gap-6 md:gap-8 shrink-0"
              >
                <span className="text-lg md:text-xl font-semibold text-foreground whitespace-nowrap">
                  {brand}
                </span>
                <span className="text-xl text-gray-300">•</span>
              </div>
            ))}
          </div>

          {/* Duplicate set for infinite loop */}
          <div className="flex items-center gap-6 md:gap-8 px-2">
            {skincareBrands.map((brand, index) => (
              <div
                key={`set2-${index}`}
                className="flex items-center gap-6 md:gap-8 shrink-0"
              >
                <span className="text-lg md:text-xl font-semibold text-foreground whitespace-nowrap">
                  {brand}
                </span>
                <span className="text-xl text-gray-300">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
