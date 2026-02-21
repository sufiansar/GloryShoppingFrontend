"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Loader2,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Shield,
  KeyRound,
  Lock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { changePasswordSchema } from "./authvalidation";
import { changePassword } from "@/action/auth/login.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type FormData = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordForm() {
  const router = useRouter();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message?: string;
    error?: string;
  } | null>(null);

  const baseColor = "oklch(52.801% 0.15987 344.323)";

  const form = useForm<FormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setResult(null);

    try {
      // Only send oldPassword and newPassword to backend
      const requestData = {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      };

      const response = (await changePassword(requestData)) as {
        success?: boolean;
        message?: string;
        error?: string;
      };

      if (response?.success) {
        setResult({
          success: true,
          message: response?.message || "Password changed successfully!",
        });
        toast.success("✅ Password changed successfully!");
        form.reset();
        router.push("/");
      } else {
        setResult({
          success: false,
          error: response?.error || "Failed to change password",
        });
      }
    } catch (error) {
      setResult({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordRequirements = [
    { label: "At least 8 characters", regex: /^.{8,}$/ },
    { label: "One uppercase letter", regex: /[A-Z]/ },
    { label: "One lowercase letter", regex: /[a-z]/ },
    { label: "One number", regex: /\d/ },
    { label: "One special character", regex: /[@$!%*?&]/ },
  ];

  const newPassword = form.watch("newPassword");
  const oldPassword = form.watch("oldPassword");
  const confirmPassword = form.watch("confirmPassword");

  // Calculate password strength
  const getPasswordStrength = () => {
    if (!newPassword) return 0;
    let strength = 0;
    passwordRequirements.forEach((req) => {
      if (req.regex.test(newPassword)) strength++;
    });
    return strength;
  };

  const passwordStrength = getPasswordStrength();
  const strengthPercentage =
    (passwordStrength / passwordRequirements.length) * 100;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-2xl rounded-3xl overflow-hidden">
        {/* Decorative header with base color */}
        <div
          className="h-2 w-full"
          style={{
            background: `linear-gradient(90deg, ${baseColor}, oklch(45% 0.14 344.323))`,
          }}
        />

        <CardHeader className="text-center pb-4 pt-8">
          <div className="inline-flex p-3 bg-linear-to-br from-pink-50 to-purple-50 rounded-2xl mb-4 border border-pink-100 mx-auto">
            <Shield
              className="w-8 h-8"
              style={{ color: baseColor }}
              strokeWidth={1.5}
            />
          </div>
          <CardTitle className="text-3xl font-bold text-slate-800">
            Change Password
          </CardTitle>
          <CardDescription className="text-slate-500 text-sm">
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 pt-2">
          {/* Result Alert */}
          {result && (
            <Alert
              className={`mb-6 rounded-xl border ${
                result.success
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <div className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600 shrink-0" />
                )}
                <AlertDescription
                  className={`text-sm ${
                    result.success ? "text-emerald-700" : "text-red-700"
                  }`}
                >
                  {result.success ? result.message : result.error}
                </AlertDescription>
              </div>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Old Password */}
              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-slate-700">
                      Current Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <KeyRound
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4"
                          strokeWidth={1.5}
                        />
                        <Input
                          type={showCurrentPassword ? "text" : "password"}
                          placeholder="Enter your current password"
                          className={`pl-9 pr-10 h-11 bg-slate-50 border-slate-200 rounded-lg focus:ring-2 transition-all ${
                            fieldState.error
                              ? "border-red-300 focus:ring-red-200"
                              : ""
                          }`}
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center hover:bg-transparent focus:outline-none"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4 text-slate-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-slate-400" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              {/* New Password */}
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-slate-700">
                      New Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4"
                          strokeWidth={1.5}
                        />
                        <Input
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          className={`pl-9 pr-10 h-11 bg-slate-50 border-slate-200 rounded-lg focus:ring-2 transition-all ${
                            fieldState.error
                              ? "border-red-300 focus:ring-red-200"
                              : ""
                          }`}
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center hover:bg-transparent focus:outline-none"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4 text-slate-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-slate-400" />
                          )}
                        </button>
                      </div>
                    </FormControl>

                    {/* Password Strength Bar */}
                    {newPassword && (
                      <div className="mt-3 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-500">
                            Password strength
                          </span>
                          <span
                            className="text-xs font-medium"
                            style={{ color: baseColor }}
                          >
                            {passwordStrength}/{passwordRequirements.length}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full transition-all duration-300 rounded-full"
                            style={{
                              width: `${strengthPercentage}%`,
                              background: `linear-gradient(90deg, ${baseColor}, oklch(45% 0.14 344.323))`,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <FormDescription className="text-xs text-slate-500 mt-3">
                      Password must contain:
                    </FormDescription>
                    <div className="grid grid-cols-1 gap-2 mt-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      {passwordRequirements.map((req) => {
                        const isValid = newPassword
                          ? req.regex.test(newPassword)
                          : false;
                        return (
                          <div
                            key={req.label}
                            className="flex items-center gap-2"
                          >
                            {isValid ? (
                              <CheckCircle
                                className="h-3.5 w-3.5 text-emerald-500"
                                strokeWidth={2}
                              />
                            ) : (
                              <XCircle
                                className="h-3.5 w-3.5 text-slate-300"
                                strokeWidth={2}
                              />
                            )}
                            <span
                              className={`text-xs ${
                                isValid
                                  ? "text-emerald-600 font-medium"
                                  : "text-slate-400"
                              }`}
                            >
                              {req.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-slate-700">
                      Confirm New Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4"
                          strokeWidth={1.5}
                        />
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm new password"
                          className={`pl-9 pr-10 h-11 bg-slate-50 border-slate-200 rounded-lg focus:ring-2 transition-all ${
                            fieldState.error
                              ? "border-red-300 focus:ring-red-200"
                              : ""
                          }`}
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center hover:bg-transparent focus:outline-none"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-slate-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-slate-400" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              {/* Password Match Status */}
              {newPassword && confirmPassword && (
                <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600">
                        Passwords match:
                      </span>
                      <span
                        className={`text-xs font-medium flex items-center gap-1 ${
                          newPassword === confirmPassword
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {newPassword === confirmPassword ? (
                          <>
                            <CheckCircle className="h-3 w-3" />
                            Yes
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3" />
                            No
                          </>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600">
                        Different from old:
                      </span>
                      <span
                        className={`text-xs font-medium flex items-center gap-1 ${
                          oldPassword !== newPassword && newPassword
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {oldPassword !== newPassword && newPassword ? (
                          <>
                            <CheckCircle className="h-3 w-3" />
                            Yes
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3" />
                            No
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 rounded-xl font-semibold text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl mt-6"
                style={{
                  background: `linear-gradient(135deg, ${baseColor}, oklch(45% 0.14 344.323))`,
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Changing Password...
                  </>
                ) : (
                  "Change Password"
                )}
              </Button>
            </form>
          </Form>

          {/* Security Note */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="flex items-start gap-2">
              <Shield
                className="h-4 w-4 text-slate-400 shrink-0 mt-0.5"
                strokeWidth={1.5}
              />
              <p className="text-xs text-slate-400">
                For your security, choose a strong password that you haven't
                used elsewhere.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
