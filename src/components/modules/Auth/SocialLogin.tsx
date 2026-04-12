"use client";

import { Button } from "@/components/ui/button";
import { Chrome } from "lucide-react";

interface SocialLoginProps {
  baseColor?: string;
}

export const SocialLogin = ({ 
  baseColor = "oklch(52.801% 0.15987 344.323)" 
}: SocialLoginProps) => {
  
  const handleGoogleLogin = () => {
    // Backend Google Login URL
    const googleLoginUrl = `${process.env.NEXT_PUBLIC_BASE_API}/auth/google`;
    window.location.href = googleLoginUrl;
  };

  return (
    <div className="w-full space-y-4">
      <div className="relative flex items-center gap-4 py-2">
        <div className="h-px flex-1 bg-slate-200"></div>
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          Or continue with
        </span>
        <div className="h-px flex-1 bg-slate-200"></div>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleLogin}
        className="w-full h-12 bg-white/50 backdrop-blur-sm border-slate-200 hover:border-slate-300 hover:bg-white transition-all duration-300 group overflow-hidden relative"
      >
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
          style={{ backgroundColor: baseColor }}
        />
        
        <div className="flex items-center justify-center gap-3 relative z-10 w-full font-semibold text-slate-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
          >
            <path
              d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
              fill="currentColor"
            />
          </svg>
          <span className="group-hover:translate-x-1 transition-transform duration-300">
            Sign in with Google
          </span>
        </div>
      </Button>
    </div>
  );
};
