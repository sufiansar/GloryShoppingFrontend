"use client";

import { Lock, Loader2 } from "lucide-react";

export default function ResetPasswordLoading() {
  const baseColor = "oklch(52.801% 0.15987 344.323)";

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-pink-50 flex items-center justify-center p-4">
      {/* Main Card */}
      <div className="w-full max-w-md">
        {/* Decorative Element */}
        <div className="text-center mb-8">
          <div className="inline-flex p-4 bg-white rounded-2xl shadow-lg mb-4 border border-slate-100 animate-pulse">
            <Lock
              className="w-8 h-8"
              style={{ color: baseColor }}
              strokeWidth={1.5}
            />
          </div>
          <div className="h-8 w-48 bg-slate-200 rounded-lg mx-auto mb-2 animate-pulse"></div>
          <div className="h-4 w-64 bg-slate-200 rounded-lg mx-auto animate-pulse"></div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
          {/* Loading Spinner */}
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative">
              {/* Outer ring */}
              <div className="w-20 h-20 rounded-full border-4 border-slate-100 animate-pulse"></div>
              {/* Inner spinner */}
              <div className="absolute top-0 left-0 w-20 h-20">
                <Loader2
                  className="w-20 h-20 animate-spin"
                  style={{ color: baseColor }}
                  strokeWidth={1.5}
                />
              </div>
            </div>

            <h3 className="text-lg font-semibold text-slate-700 mt-6 mb-2">
              Loading Reset Password Page
            </h3>
            <p className="text-sm text-slate-500 text-center max-w-xs">
              Please wait while we prepare your secure password reset form...
            </p>

            {/* Progress bar */}
            <div className="w-48 h-1.5 bg-slate-100 rounded-full mt-8 overflow-hidden">
              <div
                className="h-full rounded-full animate-progress"
                style={{
                  background: `linear-gradient(to right, ${baseColor}, oklch(45% 0.14 344.323))`,
                  width: "60%",
                }}
              ></div>
            </div>
          </div>

          {/* Skeleton Fields */}
          <div className="space-y-6 mt-4">
            {/* New Password Field Skeleton */}
            <div>
              <div className="h-4 w-24 bg-slate-200 rounded mb-2 animate-pulse"></div>
              <div className="h-12 bg-slate-100 rounded-xl animate-pulse"></div>
            </div>

            {/* Confirm Password Field Skeleton */}
            <div>
              <div className="h-4 w-28 bg-slate-200 rounded mb-2 animate-pulse"></div>
              <div className="h-12 bg-slate-100 rounded-xl animate-pulse"></div>
            </div>

            {/* Button Skeleton */}
            <div className="h-14 bg-slate-200 rounded-xl animate-pulse mt-8"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
