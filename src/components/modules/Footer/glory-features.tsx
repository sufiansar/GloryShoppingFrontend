// components/glory-features.tsx
"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Users,
  HeadphonesIcon,
  Truck,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Primary color from your design system
const PRIMARY_COLOR = "oklch(52.801% 0.15987 344.323)";
const PRIMARY_COLOR_CLASS = "text-[#ca428b]";
const PRIMARY_BG_CLASS = "bg-[#ca428b]";

export default function GloryFeatures() {
  const features = [
    {
      icon: <CheckCircle2 className="h-8 w-8" />,
      title: "100% AUTHENTIC",
      description: "All our products are 100% verified by Glory Shopping BD.",
      color: PRIMARY_COLOR_CLASS,
      bgColor: "bg-pink-50",
      hoverColor: "hover:bg-pink-100",
      borderColor: "border-pink-200",
      buttonColor: `${PRIMARY_BG_CLASS} hover:bg-[#b83a7d]`,
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "CERTIFIED BEAUTY ADVISORS",
      description: "Get expert consultation.",
      color: PRIMARY_COLOR_CLASS,
      bgColor: "bg-pink-50",
      hoverColor: "hover:bg-pink-100",
      borderColor: "border-pink-200",
      buttonColor: `${PRIMARY_BG_CLASS} hover:bg-[#b83a7d]`,
    },
    {
      icon: <HeadphonesIcon className="h-8 w-8" />,
      title: "24/7 SUPPORT",
      description: "24/7 assistance for your immediate needs.",
      color: PRIMARY_COLOR_CLASS,
      bgColor: "bg-pink-50",
      hoverColor: "hover:bg-pink-100",
      borderColor: "border-pink-200",
      buttonColor: `${PRIMARY_BG_CLASS} hover:bg-[#b83a7d]`,
    },
    {
      icon: <Truck className="h-8 w-8" />,
      title: "FASTEST DELIVERY",
      description: "Lightning-fast delivery all over Bangladesh.",
      color: PRIMARY_COLOR_CLASS,
      bgColor: "bg-pink-50",
      hoverColor: "hover:bg-pink-100",
      borderColor: "border-pink-200",
      buttonColor: `${PRIMARY_BG_CLASS} hover:bg-[#b83a7d]`,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
        mass: 1,
      },
    },
    hover: {
      y: -10,
      scale: 1.05,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 15,
      },
    },
    tap: {
      scale: 0.98,
    },
  } as const;

  const iconVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: {
      scale: 1.2,
      rotate: [0, -5, 5, 0] as number[],
      transition: {
        scale: {
          type: "spring" as const,
          stiffness: 300,
        },
        rotate: {
          duration: 0.5,
        },
      },
    },
  };

  const textVariants = {
    initial: { opacity: 0.8 },
    hover: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white p-4 md:p-8">
      {/* Brand Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <h1 className="text-4xl md:text-5xl font-bold text-[#ca428b]">
            Glory Shopping BD
          </h1>
        </div>

        <motion.p
          className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Your trusted online shopping destination in Bangladesh
        </motion.p>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          Why Choose <span className="text-[#ca428b]">Glory Shopping BD</span>?
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Card
                className={`
                  border-2 ${feature.borderColor} 
                  shadow-xl hover:shadow-2xl 
                  overflow-hidden 
                  transition-all duration-300
                  group relative
                  bg-white
                `}
              >
                {/* Animated background glow */}
                <motion.div
                  className="
                    absolute inset-0 bg-pink-100
                    opacity-0 group-hover:opacity-20
                    blur-xl
                  "
                  initial={false}
                  animate={{
                    opacity: 0,
                    scale: 1,
                  }}
                  whileHover={{
                    opacity: 0.2,
                    scale: 1.1,
                  }}
                  transition={{ duration: 0.5 }}
                />

                <CardContent className="p-8 relative z-10 flex flex-col h-full">
                  {/* Icon with floating animation */}
                  <motion.div
                    className="
                      inline-flex p-4 rounded-2xl bg-pink-50 
                      mb-6 relative
                      shadow-lg
                    "
                    variants={iconVariants}
                    animate={{
                      y: [0, -5, 0],
                    }}
                    transition={{
                      y: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                    }}
                  >
                    <div className="text-[#ca428b]">{feature.icon}</div>

                    {/* Icon glow effect */}
                    <motion.div
                      className="absolute inset-0 bg-[#ca428b] rounded-2xl blur-md opacity-0"
                      whileHover={{ opacity: 0.3 }}
                    />
                  </motion.div>

                  {/* Title */}
                  <motion.h3
                    className="text-2xl font-bold text-[#ca428b] mb-4 min-h-14"
                    variants={textVariants}
                  >
                    {feature.title}
                  </motion.h3>

                  {/* Description */}
                  <motion.p
                    className="text-gray-600 text-base leading-relaxed mb-6 line-clamp-2 min-h-12"
                    variants={textVariants}
                  >
                    {feature.description}
                  </motion.p>

                  {/* Unique label (non-button) */}
                  <motion.div
                    className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-[#ca428b] bg-pink-50 px-4 py-2 rounded-full w-fit"
                    variants={textVariants}
                  >
                    <span>Glory Promise</span>
                    <span aria-hidden="true">✦</span>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Footer CTA */}
        <motion.div
          className="text-center mt-16 p-8 rounded-2xl bg-linear-to-r from-pink-50 to-pink-100 border border-pink-200"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <motion.h3
            className="text-2xl md:text-3xl font-bold text-gray-800 mb-4"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            Experience the Glory Shopping BD Difference!
          </motion.h3>

          <motion.button
            className="
              mt-4 px-8 py-4 bg-[#ca428b] hover:bg-[#b83a7d]
              text-white font-bold text-lg rounded-full 
              shadow-lg hover:shadow-xl transition-shadow
            "
            whileHover={{
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(202, 66, 139, 0.3)",
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            Start Shopping Now →
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
