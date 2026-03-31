import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProviders from "@/providers/AuthProviders";
import { CartProvider } from "@/providers/CartProvider";
import { SocketProvider } from "@/providers/SocketProvider";
import { Toaster } from "@/components/ui/sonner";
import { LayoutChat } from "@/components/LayoutChat";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Glory Shopping BD",
  description: "Your one-stop online shop for all your needs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProviders>
          <SocketProvider>
            <CartProvider>
              {children}
              <Toaster position="top-right" richColors />
              {/* Global Chat Button - Always Accessible */}
              <LayoutChat />
            </CartProvider>
          </SocketProvider>
        </AuthProviders>
      </body>
    </html>
  );
}
