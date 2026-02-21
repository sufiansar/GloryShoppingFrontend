"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Send,
  Loader2,
} from "lucide-react";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      setMessage("Check your email for the reset link!");
      setEmail("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const baseColor = "oklch(52.801% 0.15987 344.323)";

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-pink-50 flex items-center justify-center p-4">
      {/* Back to Login Button */}
      <button
        onClick={() => router.push("/login")}
        className="absolute top-6 left-6 flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors group"
        style={{ color: baseColor }}
      >
        <ArrowLeft
          className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
          strokeWidth={1.5}
        />
        <span className="text-sm font-medium">Back to Login</span>
      </button>

      {/* Main Card */}
      <div className="w-full max-w-md">
        {/* Decorative Element */}
        <div className="text-center mb-8">
          <div className="inline-flex p-4 bg-white rounded-2xl shadow-lg mb-4 border border-slate-100">
            <Mail
              className="w-8 h-8"
              style={{ color: baseColor }}
              strokeWidth={1.5}
            />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Forgot Password?
          </h1>
          <p className="text-slate-600">
            No worries, we'll send you reset instructions
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100"
        >
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
              <AlertCircle
                className="w-5 h-5 text-red-500 shrink-0 mt-0.5"
                strokeWidth={1.5}
              />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {message && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3">
              <CheckCircle
                className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5"
                strokeWidth={1.5}
              />
              <div className="flex-1">
                <p className="text-emerald-700 text-sm font-medium mb-1">
                  Check your inbox!
                </p>
                <p className="text-emerald-600 text-sm">{message}</p>
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5"
                strokeWidth={1.5}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none transition-all text-slate-700 placeholder:text-slate-400"
                style={{
                  borderColor: error ? "#f87171" : "#e2e8f0",
                }}
                onFocus={(e) => (e.target.style.borderColor = baseColor)}
                onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full text-white py-3.5 rounded-xl font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center gap-2"
            style={{
              background: `linear-gradient(to right, ${baseColor}, oklch(45% 0.14 344.323))`,
              opacity: loading ? 0.8 : 1,
            }}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2} />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" strokeWidth={1.5} />
                <span>Send Reset Link</span>
              </>
            )}
          </button>

          {/* Help Text */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              Remember your password?{" "}
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="font-medium hover:underline transition-all"
                style={{ color: baseColor }}
              >
                Back to login
              </button>
            </p>
          </div>

          {/* Security Note */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="flex items-start gap-2">
              <AlertCircle
                className="w-4 h-4 text-slate-400 shrink-0 mt-0.5"
                strokeWidth={1.5}
              />
              <p className="text-xs text-slate-400">
                You'll receive an email if the address is registered in our
                system. The reset link will expire in 5 minutes for security
                reasons.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
