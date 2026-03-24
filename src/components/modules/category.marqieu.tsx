"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Category } from "@/types/categories.interface";
import {
  Sparkles,
  Zap,
  Orbit,
  Waves,
  Palette,
  Heart,
  Leaf,
  Droplets,
  Gem,
  Moon,
  Sun,
} from "lucide-react";

interface CategoryMarqueeProps {
  categories: Category[];
}

export function CategoryMarquee({ categories }: CategoryMarqueeProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMarqueeHovered, setIsMarqueeHovered] = useState(false);
  const marqueeRef = useRef<HTMLDivElement>(null);

  // Add floating particles effect
  useEffect(() => {
    const container = document.querySelector(".skincare-container");
    if (!container) return;

    const createParticle = () => {
      const particle = document.createElement("div");
      particle.className = "skincare-particle";
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDuration = `${Math.random() * 3 + 2}s`;
      particle.style.opacity = `${Math.random() * 0.2 + 0.1}`;
      particle.style.background = `rgba(${Math.random() * 50 + 200}, ${
        Math.random() * 100 + 150
      }, ${Math.random() * 100 + 200}, 0.3)`;
      container.appendChild(particle);

      setTimeout(() => {
        particle.remove();
      }, 5000);
    };

    const interval = setInterval(createParticle, 400);
    return () => clearInterval(interval);
  }, []);

  // Unique floating bubbles effect
  const FloatingBubbles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="absolute skincare-bubble"
          style={
            {
              "--bubble-index": i,
              left: `${20 + i * 15}%`,
              animationDelay: `${i * 2}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );

  // Enhanced marquee with physics simulation
  const SkincareCategoryCard = ({
    category,
    index,
  }: {
    category: Category;
    index: number;
  }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 15;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 15;
      setTilt({ x, y });
    };

    const skincarePatterns = [
      "radial-gradient(circle at 30% 30%, rgba(255,182,193,0.1) 0%, transparent 50%)",
      "radial-gradient(circle at 70% 70%, rgba(173,216,230,0.1) 0%, transparent 50%)",
      "radial-gradient(circle at 50% 20%, rgba(221,160,221,0.1) 0%, transparent 50%)",
      "radial-gradient(circle at 20% 70%, rgba(152,251,152,0.1) 0%, transparent 50%)",
    ];

    const skincareColorSchemes = [
      {
        bg: "linear-gradient(135deg, #FFE4E6 0%, #FBCFE8 100%)",
        glow: "#FB7185",
        border: "#FDA4AF",
      },
      {
        bg: "linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)",
        glow: "#38BDF8",
        border: "#7DD3FC",
      },
      {
        bg: "linear-gradient(135deg, #F3E8FF 0%, #E9D5FF 100%)",
        glow: "#A855F7",
        border: "#C084FC",
      },
      {
        bg: "linear-gradient(135deg, #DCFCE7 0%, #BBF7D0 100%)",
        glow: "#22C55E",
        border: "#86EFAC",
      },
      {
        bg: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
        glow: "#F59E0B",
        border: "#FCD34D",
      },
      {
        bg: "linear-gradient(135deg, #FFEDD5 0%, #FED7AA 100%)",
        glow: "#F97316",
        border: "#FDBA74",
      },
    ];

    const scheme = skincareColorSchemes[index % skincareColorSchemes.length];
    const categorySlug =
      category.name?.toLowerCase().replace(/\s+/g, "-") || "category";

    return (
      <Link href={`/categorys/${categorySlug}`} passHref>
        <div
          className="relative skincare-card group cursor-pointer"
          onMouseEnter={() => {
            setIsHovered(true);
            setActiveIndex(index);
          }}
          onMouseLeave={() => {
            setIsHovered(false);
            setTilt({ x: 0, y: 0 });
          }}
          onMouseMove={handleMouseMove}
          style={{
            transform: `perspective(1000px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) scale(${isHovered ? 1.05 : 1})`,
            transition: "transform 0.3s ease-out",
          }}
        >
          {/* Background Pattern */}
          <div
            className="absolute inset-0"
            style={{
              background: skincarePatterns[index % skincarePatterns.length],
            }}
          />

          {/* Animated Gradient Border */}
          <div className="skincare-border" style={{ background: scheme.bg }} />

          {/* Card Content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center p-4">
            {/* Dynamic Icon with hover effect */}
            <div className="relative mb-4">
              <div
                className="skincare-icon shadow-lg"
                style={{ background: scheme.bg }}
              >
                {index % 6 === 0 ? (
                  <Droplets className="w-8 h-8" />
                ) : index % 6 === 1 ? (
                  <Leaf className="w-8 h-8" />
                ) : index % 6 === 2 ? (
                  <Sparkles className="w-8 h-8" />
                ) : index % 6 === 3 ? (
                  <Heart className="w-8 h-8" />
                ) : index % 6 === 4 ? (
                  <Moon className="w-8 h-8" />
                ) : (
                  <Sun className="w-8 h-8" />
                )}
              </div>
              {isHovered && (
                <div
                  className="skincare-icon-aura"
                  style={{ "--glow-color": scheme.glow } as React.CSSProperties}
                />
              )}
            </div>

            {/* Category Name */}
            <h3 className="skincare-title font-bold mb-2">{category.name}</h3>

            {/* Product Count (if available) */}
            {/* {category.name && (
              <div className="skincare-count">
                {category.productCount} products
              </div>
            )} */}

            {/* View Button */}
            <button
              className="skincare-button mt-3"
              onClick={(e) => e.preventDefault()}
            >
              <span>Shop Now</span>
              <div className="skincare-button-particles">
                {[...Array(3)].map((_, i) => (
                  <span
                    key={i}
                    className="skincare-particle-dot"
                    style={{
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            </button>
          </div>

          {/* Holographic Rings on Hover */}
          {isHovered && (
            <div className="absolute inset-0">
              {[...Array(2)].map((_, ringIndex) => (
                <div
                  key={ringIndex}
                  className="skincare-data-ring"
                  style={{
                    animationDelay: `${ringIndex * 0.3}s`,
                    borderColor: scheme.border,
                  }}
                />
              ))}
            </div>
          )}

          {/* Shimmer Effect */}
          <div className="absolute inset-0 shimmer-effect" />
        </div>
      </Link>
    );
  };

  if (!categories || categories.length === 0) {
    return (
      <div className="skincare-container">
        <div className="skincare-empty-state">
          <Sparkles className="animate-pulse" size={48} />
          <p className="text-gray-600">No categories available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="skincare-container">
      <style jsx global>{`
        .skincare-container {
          background: linear-gradient(
            135deg,
            #f8f9fa 0%,
            #f0f3f8 50%,
            #e8f1f8 100%
          );
          position: relative;
          overflow: hidden;
          min-height: 350px;
          border-top: 1px solid rgba(0, 0, 0, 0.05);
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }

        .skincare-particle {
          position: absolute;
          width: 3px;
          height: 3px;
          background: rgba(168, 85, 247, 0.2);
          border-radius: 50%;
          animation: skincare-float linear infinite;
          pointer-events: none;
        }

        @keyframes skincare-float {
          0% {
            transform: translateY(100vh) scale(0);
          }
          100% {
            transform: translateY(-100px) scale(1);
          }
        }

        .skincare-bubble {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 50%;
          animation: bubble-float 8s ease-in-out infinite;
          filter: blur(2px);
          opacity: 0.3;
        }

        @keyframes bubble-float {
          0%,
          100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-50px) scale(1.1);
          }
        }

        .skincare-card {
          width: 170px;
          height: 220px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.8);
        }

        .skincare-card:hover {
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          transform: translateY(-8px) !important;
        }

        .skincare-border {
          position: absolute;
          inset: -1px;
          border-radius: 21px;
          padding: 1px;
          mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          animation: border-spin 4s linear infinite;
        }

        @keyframes border-spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .skincare-icon {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #4b5563;
          transition: all 0.3s;
          border: 2px solid white;
        }

        .skincare-icon-aura {
          position: absolute;
          inset: -15px;
          border-radius: 50%;
          background: var(--glow-color);
          filter: blur(15px);
          opacity: 0.3;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.5;
          }
        }

        .skincare-title {
          color: #1f2937;
          font-size: 15px;
          font-weight: 600;
          text-align: center;
          line-height: 1.3;
        }

        .skincare-count {
          color: #6b7280;
          font-size: 12px;
          font-weight: 500;
        }

        .skincare-button {
          position: relative;
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          color: white;
          padding: 8px 20px;
          border-radius: 25px;
          font-size: 12px;
          font-weight: 600;
          transition: all 0.3s;
          overflow: hidden;
          border: none;
          cursor: pointer;
        }

        .skincare-button:hover {
          background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(124, 58, 237, 0.3);
        }

        .skincare-button-particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .skincare-particle-dot {
          position: absolute;
          width: 4px;
          height: 4px;
          background: white;
          border-radius: 50%;
          animation: particle-explode 1s forwards;
        }

        @keyframes particle-explode {
          0% {
            transform: translate(0, 0) scale(0);
            opacity: 1;
          }
          100% {
            transform: translate(
                calc(var(--tx, 0) * 20px),
                calc(var(--ty, 0) * 20px)
              )
              scale(1);
            opacity: 0;
          }
        }

        .skincare-data-ring {
          position: absolute;
          inset: -10px;
          border: 1px solid;
          border-radius: 25px;
          animation: ring-expand 1.5s infinite;
        }

        @keyframes ring-expand {
          0% {
            transform: scale(0.9);
            opacity: 1;
          }
          100% {
            transform: scale(1.1);
            opacity: 0;
          }
        }

        .shimmer-effect {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          animation: shimmer 3s infinite;
          opacity: 0;
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }

        .skincare-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 300px;
          color: #6b7280;
          gap: 20px;
        }

        /* Header styling */
        .marquee-header {
          text-align: center;
          padding: 30px 0 20px;
        }

        .marquee-header h2 {
          font-size: 28px;
          font-weight: 700;
          background: linear-gradient(135deg, #ec4899 0%, #f59e0b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 8px;
        }

        .marquee-header p {
          color: #6b7280;
          font-size: 14px;
        }
      `}</style>

      <FloatingBubbles />

      {/* Header Section */}
      <div className="marquee-header">
        <h2>Explore Our Collections</h2>
      </div>

      {/* Enhanced Marquee */}
      <div
        className="relative py-10 px-4"
        onMouseEnter={() => setIsMarqueeHovered(true)}
        onMouseLeave={() => setIsMarqueeHovered(false)}
      >
        <div
          ref={marqueeRef}
          className="flex gap-6"
          style={{
            animation: `marquee-scroll-left-to-right 8.5s linear ${isMarqueeHovered ? "paused" : "running"} infinite`,
            paddingLeft: "50px",
          }}
        >
          {[...categories, ...categories, ...categories].map(
            (category, index) => (
              <SkincareCategoryCard
                key={`${category.id}-${index}`}
                category={category}
                index={index % categories.length}
              />
            ),
          )}
        </div>
      </div>

      {/* Category Indicator */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center">
        <div className="skincare-dimension-tracker bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
          {categories.map((_, idx) => (
            <div
              key={idx}
              className={`skincare-tracker-dot ${
                idx === activeIndex ? "active" : ""
              }`}
              //   style={
              //     {
              //       "--dot-color":
              //         skincareColorSchemes[idx % skincareColorSchemes.length]
              //           .glow,
              //     } as React.CSSProperties
              //   }
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Add these additional styles
const marqueeStyles = `
  @keyframes marquee-scroll-left-to-right {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  .skincare-dimension-tracker {
    display: flex;
    gap: 6px;
    padding: 8px 16px;
  }

  .skincare-tracker-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #E5E7EB;
    transition: all 0.3s;
  }

  .skincare-tracker-dot.active {
    width: 20px;
    border-radius: 4px;
    background: var(--dot-color);
    box-shadow: 0 0 8px var(--dot-color);
  }

`;

// Inject additional styles
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = marqueeStyles;
  document.head.appendChild(styleSheet);
}

export default CategoryMarquee;
