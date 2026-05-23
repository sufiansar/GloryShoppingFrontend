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
      category.slug || category.name?.toLowerCase().replace(/\s+/g, "-") || "category";

    // Resolve first image URL from the images array
    const firstImage = category.images && category.images.length > 0
      ? typeof category.images[0] === "string"
        ? category.images[0]
        : (category.images[0] as { url: string }).url
      : null;

    return (
      <Link href={`/categorys/${categorySlug}`} passHref>
        <div
          className="relative group cursor-pointer flex-shrink-0"
          style={{
            width: "180px",
            height: "220px",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: isHovered
              ? "0 20px 40px rgba(0,0,0,0.18), 0 8px 16px rgba(0,0,0,0.12)"
              : "0 4px 16px rgba(0,0,0,0.10)",
            border: "1px solid rgba(0,0,0,0.07)",
            transition: "transform 0.35s cubic-bezier(.25,.8,.25,1), box-shadow 0.35s ease",
            transform: isHovered ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => { setIsHovered(false); setTilt({ x: 0, y: 0 }); }}
        >
          {/* Full-bleed image / icon bg */}
          <div style={{ position: "absolute", inset: 0, background: scheme.bg }}>
            {firstImage ? (
              <img
                src={firstImage}
                alt={category.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.5s ease",
                  transform: isHovered ? "scale(1.12)" : "scale(1)",
                }}
              />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {index % 6 === 0 ? <Droplets style={{ width: 56, height: 56, opacity: 0.35 }} />
                  : index % 6 === 1 ? <Leaf style={{ width: 56, height: 56, opacity: 0.35 }} />
                  : index % 6 === 2 ? <Sparkles style={{ width: 56, height: 56, opacity: 0.35 }} />
                  : index % 6 === 3 ? <Heart style={{ width: 56, height: 56, opacity: 0.35 }} />
                  : index % 6 === 4 ? <Moon style={{ width: 56, height: 56, opacity: 0.35 }} />
                  : <Sun style={{ width: 56, height: 56, opacity: 0.35 }} />}
              </div>
            )}
          </div>

          {/* Name strip — frosted white pill at bottom, NO gradient */}
          <div style={{
            position: "absolute",
            bottom: "12px",
            left: "12px",
            right: "12px",
          }}>
            <p style={{
              margin: 0,
              fontSize: "13px",
              fontWeight: 700,
              color: "#111827",
              letterSpacing: "0.01em",
              lineHeight: 1.3,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
              {category.name}
            </p>
            {/* Shop arrow — slides in on hover */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "3px",
              marginTop: "3px",
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? "translateY(0)" : "translateY(5px)",
              transition: "opacity 0.25s ease, transform 0.25s ease",
            }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#fff", letterSpacing: "0.04em", textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>Shop Now</span>
              <span style={{ fontSize: "12px", color: "#fff" }}>→</span>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  if (!categories || categories.length === 0) {
    return (
      <div className="skincare-container hidden md:block">
        <div className="skincare-empty-state">
          <Sparkles className="animate-pulse" size={48} />
          <p className="text-gray-600">No categories available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="skincare-container hidden md:block">
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
          min-height: 250px;
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
          width: 200px;
          height: 260px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(10px);
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.9);
          flex-shrink: 0;
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

        .skincare-category-img {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          overflow: hidden;
          position: relative;
          border: 3px solid white;
          transition: all 0.3s;
        }

        .skincare-category-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .skincare-category-img:hover img {
          transform: scale(1.1);
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
          font-size: 16px;
          font-weight: 700;
          text-align: center;
          line-height: 1.4;
          letter-spacing: 0.3px;
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

      {/* Enhanced Marquee */}
      <div
        className="relative py-3 px-4"
        onMouseEnter={() => setIsMarqueeHovered(true)}
        onMouseLeave={() => setIsMarqueeHovered(false)}
      >
        <div
          ref={marqueeRef}
          className="flex gap-4"
          style={{
            animation: `marquee-scroll-left-to-right 60s linear ${isMarqueeHovered ? "paused" : "running"} infinite`,
            paddingLeft: "60px",
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

    </div>
  );
}

// Add these additional styles
const marqueeStyles = `
  @keyframes marquee-scroll-left-to-right {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }


`;

// Inject additional styles
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = marqueeStyles;
  document.head.appendChild(styleSheet);
}

export default CategoryMarquee;
