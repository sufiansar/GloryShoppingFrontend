"use client";

import { Mail, Loader2 } from "lucide-react";

export default function ForgotPasswordLoading() {
  const baseColor = "oklch(52.801% 0.15987 344.323)";

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-pink-50 flex items-center justify-center p-4">
      {/* Main Card */}
      <div className="w-full max-w-md">
        {/* Decorative Element */}
        <div className="text-center mb-8">
          <div className="inline-flex p-4 bg-white rounded-2xl shadow-lg mb-4 border border-slate-100 animate-pulse">
            <Mail
              className="w-8 h-8"
              style={{ color: baseColor }}
              strokeWidth={1.5}
            />
          </div>
          <div className="h-8 w-56 bg-slate-200 rounded-lg mx-auto mb-2 animate-pulse"></div>
          <div className="h-4 w-72 bg-slate-200 rounded-lg mx-auto animate-pulse"></div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
          {/* Loading Spinner */}
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative">
              {/* Pulsing circles */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-16 h-16 rounded-full opacity-20 animate-ping"
                  style={{ backgroundColor: baseColor }}
                ></div>
              </div>
              {/* Main spinner */}
              <div className="relative">
                <Loader2
                  className="w-20 h-20 animate-spin"
                  style={{ color: baseColor }}
                  strokeWidth={1.5}
                />
              </div>
            </div>

            <h3 className="text-lg font-semibold text-slate-700 mt-6 mb-2">
              Loading Forgot Password
            </h3>
            <p className="text-sm text-slate-500 text-center max-w-xs">
              Getting your password reset request form ready...
            </p>

            {/* Animated dots */}
            <div className="flex gap-2 mt-6">
              {[1, 2, 3].map((dot) => (
                <div
                  key={dot}
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{
                    backgroundColor: baseColor,
                    animationDelay: `${dot * 0.15}s`,
                  }}
                ></div>
              ))}
            </div>
          </div>

          {/* Skeleton Fields */}
          <div className="space-y-6 mt-4">
            {/* Email Field Skeleton */}
            <div>
              <div className="h-4 w-24 bg-slate-200 rounded mb-2 animate-pulse"></div>
              <div className="h-12 bg-slate-100 rounded-xl animate-pulse"></div>
              <div className="h-3 w-48 bg-slate-200 rounded mt-2 animate-pulse"></div>
            </div>

            {/* Button Skeleton */}
            <div className="h-14 bg-slate-200 rounded-xl animate-pulse mt-8"></div>
          </div>

          {/* Footer Skeleton */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-center gap-2">
              <div className="h-3 w-3 bg-slate-200 rounded-full animate-pulse"></div>
              <div className="h-3 w-48 bg-slate-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
