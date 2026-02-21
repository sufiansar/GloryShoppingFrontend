import { LoginForm } from "@/components/modules/Auth/Login/LoginForm";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Home, ShoppingBag } from "lucide-react";

export default function LoginPage() {
  const baseColor = "oklch(52.801% 0.15987 344.323)";

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-pink-50 flex flex-col items-center justify-center p-6 md:p-10 relative">
      {/* Back to Home Indicator */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 z-10">
        <Link
          href="/"
          className="group flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 border border-slate-200"
          style={{
            boxShadow: `0 4px 12px ${baseColor}20`,
          }}
        >
          <ArrowLeft
            className="w-4 h-4 transition-transform group-hover:-translate-x-1"
            style={{ color: baseColor }}
            strokeWidth={2}
          />
          <span className="text-sm font-medium text-slate-700">
            Back to Home
          </span>
          <Home
            className="w-4 h-4 ml-1 opacity-70 group-hover:opacity-100 transition-opacity"
            style={{ color: baseColor }}
            strokeWidth={1.5}
          />
        </Link>
      </div>

      {/* Brand Logo/Indicator - Top Right */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 z-10">
        <Link
          href="/"
          className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-slate-200"
        >
          <ShoppingBag
            className="w-4 h-4"
            style={{ color: baseColor }}
            strokeWidth={1.5}
          />
          <span className="text-sm font-semibold" style={{ color: baseColor }}>
            Glory Shopping
          </span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-sm md:max-w-4xl relative">
        {/* Decorative Header for Mobile/Tablet */}
        <div className="text-center mb-6 md:hidden">
          <div className="inline-flex p-3 bg-linear-to-br from-pink-50 to-purple-50 rounded-2xl mb-3 border border-pink-100">
            <ShoppingBag
              className="w-6 h-6"
              style={{ color: baseColor }}
              strokeWidth={1.5}
            />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome Back</h1>
          <p className="text-sm text-slate-500">Login to your account</p>
        </div>

        {/* Suspense with better fallback */}
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center p-12 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-100">
              <div className="relative">
                <div
                  className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-4 animate-spin"
                  style={{ borderTopColor: baseColor }}
                />
              </div>
              <p className="mt-4 text-sm text-slate-500">
                Loading login form...
              </p>
            </div>
          }
        >
          <LoginForm />
        </Suspense>

        {/* Footer Links */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
            <Link href="#" className="hover:text-slate-600 transition-colors">
              Privacy Policy
            </Link>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <Link href="#" className="hover:text-slate-600 transition-colors">
              Terms of Service
            </Link>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <Link href="#" className="hover:text-slate-600 transition-colors">
              Support
            </Link>
          </div>

          {/* Decorative line */}
          <div
            className="w-24 h-0.5 rounded-full"
            style={{
              background: `linear-gradient(90deg, transparent, ${baseColor}, transparent)`,
            }}
          />

          <p className="text-xs text-slate-400">
            © 2026 Glory Shopping. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
