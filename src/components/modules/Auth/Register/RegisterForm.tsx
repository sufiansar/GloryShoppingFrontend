"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/action/user/user.action";
import {
  User,
  Mail,
  Phone,
  Lock,
  Sparkles,
  UserPlus,
  Eye,
  EyeOff,
} from "lucide-react";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const baseColor = "oklch(52.801% 0.15987 344.323)";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name")?.toString().trim() || "";
    const email = formData.get("email")?.toString().trim() || "";
    const phone = formData.get("phone")?.toString().trim() || "";
    const password = formData.get("password")?.toString() || "";
    const confirmPassword = formData.get("confirmPassword")?.toString() || "";

    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    try {
      const result: any = await registerUser({
        name,
        email,
        phone,
        passwordHash: password,
      });

      if (result?.success === false || result?.statusCode >= 400) {
        setFormError(result?.message || "Registration failed.");
        return;
      }

      router.push("/login");
    } catch (error: any) {
      setFormError(error?.message || "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border-0 shadow-2xl rounded-3xl">
        <CardContent className="grid p-0 md:grid-cols-2 min-h-175">
          {/* Left side - Form */}
          <div className="relative bg-white p-8 md:p-10 flex items-center">
            {/* Decorative background pattern */}
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, ${baseColor} 1px, transparent 0)`,
                backgroundSize: "40px 40px",
              }}
            />

            <form
              className="w-full max-w-sm mx-auto space-y-6 relative z-10"
              onSubmit={handleSubmit}
            >
              <FieldGroup>
                {/* Welcome Header with Icon */}
                <div className="flex flex-col items-center gap-2 text-center mb-2">
                  <div className="inline-flex p-3 bg-linear-to-br from-pink-50 to-purple-50 rounded-2xl mb-2 border border-pink-100">
                    <UserPlus
                      className="w-6 h-6"
                      style={{ color: baseColor }}
                      strokeWidth={1.5}
                    />
                  </div>
                  <h1 className="text-3xl font-bold text-slate-800">
                    Create account
                  </h1>
                  <p className="text-slate-500 text-sm">
                    Join Glory Shopping today
                  </p>
                </div>

                {/* Name Field */}
                <Field>
                  <FieldLabel
                    htmlFor="name"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Full Name
                  </FieldLabel>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4"
                      strokeWidth={1.5}
                    />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      required
                      className="pl-9 h-11 bg-slate-50 border-slate-200 rounded-lg focus:ring-2 focus:ring-[oklch(52.801%_0.15987_344.323)/40] transition-all"
                    />
                  </div>
                </Field>

                {/* Email Field */}
                <Field>
                  <FieldLabel
                    htmlFor="email"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Email Address
                  </FieldLabel>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4"
                      strokeWidth={1.5}
                    />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      className="pl-9 h-11 bg-slate-50 border-slate-200 rounded-lg focus:ring-2 focus:ring-[oklch(52.801%_0.15987_344.323)/40] transition-all"
                    />
                  </div>
                </Field>

                {/* Phone Field */}
                <Field>
                  <FieldLabel
                    htmlFor="phone"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Phone Number
                  </FieldLabel>
                  <div className="relative">
                    <Phone
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4"
                      strokeWidth={1.5}
                    />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="017XXXXXXXX"
                      required
                      className="pl-9 h-11 bg-slate-50 border-slate-200 rounded-lg focus:ring-2 transition-all"
                      style={{ outline: `2px solid ${baseColor}40` }}
                    />
                  </div>
                </Field>

                {/* Password Fields Grid */}
                <Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel
                        htmlFor="password"
                        className="text-sm font-semibold text-slate-700"
                      >
                        Password
                      </FieldLabel>
                      <div className="relative">
                        <Lock
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4"
                          strokeWidth={1.5}
                        />
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          required
                          className="pl-9 pr-10 h-11 bg-slate-50 border-slate-200 rounded-lg focus:ring-2 transition-all"
                          style={{ outline: `2px solid ${baseColor}40` }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </Field>
                    <Field>
                      <FieldLabel
                        htmlFor="confirm-password"
                        className="text-sm font-semibold text-slate-700"
                      >
                        Confirm
                      </FieldLabel>
                      <div className="relative">
                        <Lock
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4"
                          strokeWidth={1.5}
                        />
                        <Input
                          id="confirm-password"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          className="pl-9 pr-10 h-11 bg-slate-50 border-slate-200 rounded-lg focus:ring-2 transition-all"
                          style={{ outline: `2px solid ${baseColor}40` }}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </Field>
                  </div>
                  <FieldDescription className="text-xs text-slate-500 mt-2">
                    Must be at least 8 characters long.
                  </FieldDescription>
                </Field>

                {/* Error Message */}
                {formError ? (
                  <Field>
                    <p className="text-sm text-red-500 text-center bg-red-50 p-3 rounded-lg border border-red-100">
                      {formError}
                    </p>
                  </Field>
                ) : null}

                {/* Submit Button */}
                <Field>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11 rounded-lg font-semibold text-white transition-all hover:opacity-90 shadow-md hover:shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${baseColor}, oklch(45% 0.14 344.323))`,
                    }}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating account...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <UserPlus className="w-4 h-4" strokeWidth={2} />
                        Create Account
                      </span>
                    )}
                  </Button>
                </Field>

                {/* Separator */}
                <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card text-slate-400">
                  Or continue with
                </FieldSeparator>

                {/* Google Sign Up */}
                <Field>
                  <Button
                    variant="outline"
                    type="button"
                    className="w-full h-11 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-4 h-4 mr-2"
                    >
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    <span>Sign up with Google</span>
                  </Button>
                </Field>

                {/* Sign in link */}
                <FieldDescription className="text-center text-sm">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-medium inline-flex items-center gap-1 hover:gap-2 transition-all"
                    style={{ color: baseColor }}
                  >
                    Sign in
                    <Sparkles className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </Link>
                </FieldDescription>
              </FieldGroup>
            </form>
          </div>

          {/* Right side - Image with overlay */}
          <div className="relative hidden md:block overflow-hidden bg-linear-to-br from-pink-100 to-purple-100">
            {/* Gradient overlay */}
            <div
              className="absolute inset-0 z-10 mix-blend-multiply"
              style={{
                background: `linear-gradient(135deg, ${baseColor}40, ${baseColor}80)`,
              }}
            />

            {/* Image */}
            {/* <img
              src="/placeholder.svg"
              alt="Signup"
              className="absolute inset-0 h-full w-full object-cover"
            /> */}

            {/* Quote overlay */}
            <div className="absolute bottom-6 left-6 right-6 z-20 text-white">
              <blockquote className="space-y-1">
                <p className="text-sm font-medium italic">
                  "Join thousands of happy shoppers"
                </p>
                <footer className="text-xs text-white/70">
                  — Start your journey today
                </footer>
              </blockquote>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
