"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Lock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Loader2,
} from "lucide-react";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Wait until client renders
  useEffect(() => {
    const t = searchParams.get("token");
    const u = searchParams.get("id");

    if (!t || !u) {
      setError("Token or user ID is missing in the URL.");
    } else {
      setToken(t);
      setUserId(u);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!token || !userId) {
      setError("Token missing. Cannot reset password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, token, newPassword }),
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      setMessage("Password reset successfully! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
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
            <Lock
              className="w-8 h-8"
              style={{ color: baseColor }}
              strokeWidth={1.5}
            />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Reset Password
          </h1>
          <p className="text-slate-600">Enter your new password below</p>
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
              <p className="text-emerald-700 text-sm">{message}</p>
            </div>
          )}

          {/* New Password Field */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5"
                strokeWidth={1.5}
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 transition-all text-slate-700 placeholder:text-slate-400"
                style={{
                  borderColor: error ? "#f87171" : "#e2e8f0",
                }}
                onFocus={(e) => (e.target.style.borderColor = baseColor)}
                onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                placeholder="Enter new password"
                required
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Password must be at least 8 characters long
            </p>
          </div>

          {/* Confirm Password Field */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5"
                strokeWidth={1.5}
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 transition-all text-slate-700 placeholder:text-slate-400"
                style={{
                  borderColor:
                    error && newPassword !== confirmPassword
                      ? "#f87171"
                      : "#e2e8f0",
                }}
                onFocus={(e) => (e.target.style.borderColor = baseColor)}
                onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                placeholder="Confirm new password"
                required
              />
            </div>
          </div>

          {/* Password Strength Indicator */}
          {newPassword && (
            <div className="mb-6">
              <div className="flex gap-1.5 mb-2">
                {[1, 2, 3, 4].map((strength) => (
                  <div
                    key={strength}
                    className={`h-1.5 flex-1 rounded-full transition-all ${
                      newPassword.length >= 8
                        ? strength <= 3
                          ? "bg-opacity-100"
                          : "bg-slate-200"
                        : "bg-slate-200"
                    }`}
                    style={
                      strength <= 3 && newPassword.length >= 8
                        ? { backgroundColor: baseColor }
                        : {}
                    }
                  />
                ))}
              </div>
              <p className="text-xs text-slate-500">
                {newPassword.length >= 8
                  ? "✓ Strong password"
                  : "Add at least 8 characters for a strong password"}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !token || !userId}
            className="w-full text-white py-3.5 rounded-xl font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center gap-2"
            style={{
              background: `linear-gradient(to right, ${baseColor}, oklch(45% 0.14 344.323))`,
              opacity: loading ? 0.8 : 1,
            }}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2} />
                <span>Resetting...</span>
              </>
            ) : (
              "Reset Password"
            )}
          </button>

          {/* Security Note */}
          <p className="text-xs text-center text-slate-400 mt-6">
            This link will expire in 5 minutes for security reasons
          </p>
        </form>
      </div>
    </div>
  );
}
