import ChangePasswordForm from "@/components/modules/Auth/ChangePasswordForm";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Home, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Change Password",
  description: "Change your account password",
};

export default function ChangePasswordPage() {
  const baseColor = "oklch(52.801% 0.15987 344.323)";

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Back to Home Indicator */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8">
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

      {/* Main Content */}
      <div className="w-full max-w-md mx-auto">
        {/* Decorative Header */}
        <div className="text-center mb-8 relative">
          {/* Decorative background element */}
          <div
            className="absolute inset-0 -top-10 mx-auto w-24 h-24 rounded-full opacity-10 blur-2xl"
            style={{ backgroundColor: baseColor }}
          />

          {/* Icon with gradient background */}
          <div className="inline-flex p-4 bg-linear-to-br from-pink-50 to-purple-50 rounded-2xl mb-4 border border-pink-100 shadow-lg">
            <Shield
              className="w-10 h-10"
              style={{ color: baseColor }}
              strokeWidth={1.5}
            />
          </div>

          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Account Security
          </h1>
          <p className="text-slate-600 text-sm max-w-sm mx-auto">
            Keep your account safe with a strong password
          </p>

          {/* Decorative line */}
          <div
            className="w-24 h-1 mx-auto mt-4 rounded-full"
            style={{
              background: `linear-gradient(90deg, ${baseColor}40, ${baseColor}, ${baseColor}40)`,
            }}
          />
        </div>

        {/* Change Password Form */}
        <ChangePasswordForm />

        {/* Support Link */}
        <div className="mt-8 text-center bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-slate-100">
          <p className="text-sm text-slate-600 flex items-center justify-center gap-2">
            <span>Need help?</span>
            <Link
              href="/support"
              className="font-medium inline-flex items-center gap-1 hover:gap-2 transition-all"
              style={{ color: baseColor }}
            >
              Contact our support team
              <ArrowLeft className="w-3 h-3 rotate-180" strokeWidth={2} />
            </Link>
          </p>
        </div>

        {/* Footer Links */}
        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-400">
          <Link
            href="/privacy"
            className="hover:text-slate-600 transition-colors"
          >
            Privacy Policy
          </Link>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <Link
            href="/terms"
            className="hover:text-slate-600 transition-colors"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </div>
  );
}
