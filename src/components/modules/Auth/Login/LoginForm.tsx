"use client";

import { z } from "zod";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { getSession, signIn } from "next-auth/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getDefaultDashboardRoute,
  isValidRedirectForRole,
} from "@/lib/auth-utils";
import Password from "@/components/ui/Password";
import Image from "next/image";
import { Mail, Lock, LogIn, Sparkles } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const searchParams = useSearchParams();
  const callbackUrl =
    searchParams.get("redirect") || searchParams.get("callbackUrl") || "";
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();
  const baseColor = "oklch(52.801% 0.15987 344.323)";

  async function onSubmit(values: FieldValues) {
    try {
      const result = await signIn("credentials", {
        ...values,
        callbackUrl: callbackUrl || "/",
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      const session = await getSession();
      const role = session?.user?.role || "USER";
      const target =
        callbackUrl && isValidRedirectForRole(callbackUrl, role)
          ? callbackUrl
          : getDefaultDashboardRoute(role);

      router.push(target);
      toast.success("✅ Logged in successfully!");
    } catch (error) {
      console.log("Login error:", error);
      toast.error("Login failed. Please check your credentials and try again.");
    }
  }

  return (
    <Card className="overflow-hidden p-0 border-0 shadow-2xl rounded-3xl">
      <CardContent className="grid p-0 md:grid-cols-2 min-h-150">
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

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full max-w-sm mx-auto space-y-6 relative z-10"
              {...props}
            >
              <FieldGroup>
                {/* Welcome Header with Icon */}
                <div className="flex flex-col items-center gap-2 text-center mb-2">
                  <div className="inline-flex p-3 bg-linear-to-br from-pink-50 to-purple-50 rounded-2xl mb-2 border border-pink-100">
                    <LogIn
                      className="w-6 h-6"
                      style={{ color: baseColor }}
                      strokeWidth={1.5}
                    />
                  </div>
                  <h1 className="text-3xl font-bold text-slate-800">
                    Welcome back
                  </h1>
                  <p className="text-slate-500 text-sm">
                    Login to your Glory Shopping account
                  </p>
                </div>

                {/* Email Field */}
                <Field>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FieldLabel
                          htmlFor="email"
                          className="text-sm font-semibold text-slate-700"
                        >
                          Email Address
                        </FieldLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4"
                              strokeWidth={1.5}
                            />
                            <Input
                              id="email"
                              type="email"
                              placeholder="m@example.com"
                              className={cn(
                                "pl-9 h-11 bg-slate-50 border-slate-200 rounded-lg focus:ring-2 transition-all",
                                fieldState.error
                                  ? "border-red-300 focus:ring-red-200"
                                  : "focus:ring-2",
                              )}
                              style={
                                {
                                  // No custom focusRing property; use only valid CSS properties
                                }
                              }
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs mt-1 text-red-500" />
                      </FormItem>
                    )}
                  />
                </Field>

                {/* Password Field */}
                <Field>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FieldLabel
                            htmlFor="password"
                            className="text-sm font-semibold text-slate-700"
                          >
                            Password
                          </FieldLabel>
                          <Link
                            href="/forgot-password"
                            className="text-xs hover:underline transition-all"
                            style={{ color: baseColor }}
                          >
                            Forgot password?
                          </Link>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <Lock
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4"
                              strokeWidth={1.5}
                            />
                            <Password
                              id="password"
                              className={cn(
                                "pl-9 h-11 bg-slate-50 border-slate-200 rounded-lg focus:ring-2 transition-all",
                                fieldState.error
                                  ? "border-red-300 focus:ring-red-200"
                                  : "",
                              )}
                              style={{
                                ...(fieldState.error
                                  ? {}
                                  : { focusRing: `2px solid ${baseColor}40` }),
                              }}
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs mt-1 text-red-500" />
                      </FormItem>
                    )}
                  />
                </Field>

                {/* Submit Button */}
                <Field>
                  <Button
                    type="submit"
                    className="w-full h-11 rounded-lg font-semibold text-white transition-all hover:opacity-90 shadow-md hover:shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${baseColor}, oklch(45% 0.14 344.323))`,
                    }}
                  >
                    Login
                  </Button>
                </Field>

                {/* Sign up link */}
                <FieldDescription className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    className="font-medium inline-flex items-center gap-1 hover:gap-2 transition-all"
                    style={{ color: baseColor }}
                  >
                    Sign up
                    <Sparkles className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </Link>
                </FieldDescription>
              </FieldGroup>
            </form>
          </Form>
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
          {/* <Image
            src="/assets/login-image.jpg"
            alt="Login image"
            fill
            className="object-cover"
            priority
          /> */}

          {/* Quote overlay */}
          <div className="absolute bottom-6 left-6 right-6 z-20 text-white">
            <blockquote className="space-y-1">
              <p className="text-sm font-medium italic">
                "The best shopping experience starts here"
              </p>
              <footer className="text-xs text-white/70">
                — Glory Shopping Team
              </footer>
            </blockquote>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
