// components/footer/EcommerceFooter.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Shield,
  Truck,
  RefreshCw,
  CreditCard,
  ChevronRight,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

interface NewsletterData {
  email: string;
  subscribed: boolean;
}

const Footer = () => {
  const [newsletter, setNewsletter] = useState<NewsletterData>({
    email: "",
    subscribed: false,
  });

  const [theme, setTheme] = useState<"light" | "dark">("light");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletter.email) {
      console.log("Subscribed:", newsletter.email);
      setNewsletter({ email: "", subscribed: true });
      setTimeout(() => {
        setNewsletter((prev) => ({ ...prev, subscribed: false }));
      }, 3000);
    }
  };

  const quickLinks = [
    { label: "New Arrivals", href: "/new-arrivals" },
    { label: "Best Sellers", href: "/best-sellers" },
    { label: "Sale", href: "/sale", badge: "HOT" },
    { label: "Limited Edition", href: "/limited" },
  ];

  const supportLinks = [
    { label: "Contact Us", href: "/contact" },
    { label: "FAQ", href: "/faq" },
    { label: "Shipping Info", href: "/shipping" },
    { label: "Returns & Exchanges", href: "/returns" },
    { label: "Size Guide", href: "/size-guide" },
  ];

  const companyLinks = [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
    { label: "Sustainability", href: "/sustainability" },
    { label: "Store Locator", href: "/stores" },
  ];

  const trustBadges = [
    { icon: Shield, label: "Secure Payments" },
    { icon: Truck, label: "Free Shipping Over $50" },
    { icon: RefreshCw, label: "30-Day Returns" },
    { icon: CreditCard, label: "Price Match Guarantee" },
  ];

  const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  const paymentMethods = [
    "Visa",
    "Mastercard",
    "Amex",
    "PayPal",
    "Apple Pay",
    "Google Pay",
  ];

  return (
    <footer
      className={`relative ${
        theme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-linear-to-b from-gray-50 to-white text-gray-800"
      } border-t`}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#000_1px,transparent_0)] bg-size-[40px_40px]"></div>
      </div>

      <div className="relative container mx-auto px-4 py-12">
        {/* Top Section - Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {trustBadges.map((badge, index) => (
            <div
              key={index}
              className={`flex items-center justify-center gap-3 p-4 rounded-xl ${
                theme === "dark" ? "bg-gray-800/50" : "bg-white"
              } shadow-sm hover:shadow-md transition-shadow duration-300`}
            >
              <badge.icon
                className={`w-6 h-6 ${
                  theme === "dark" ? "text-blue-400" : "text-blue-600"
                }`}
              />
              <span className="font-medium text-sm">{badge.label}</span>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Newsletter Column */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Stay Updated</h2>
              <p className="text-sm opacity-75">
                Get exclusive deals and early access to new collections
              </p>
            </div>

            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={newsletter.email}
                  onChange={(e) =>
                    setNewsletter((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className={`flex-1 ${
                    theme === "dark" ? "bg-gray-800 border-gray-700" : ""
                  }`}
                  required
                />
                <Button type="submit" className="gap-2">
                  <Send className="w-4 h-4" />
                  Join
                </Button>
              </div>

              {newsletter.subscribed && (
                <div
                  className={`p-3 rounded-lg ${
                    theme === "dark"
                      ? "bg-green-900/30 text-green-300"
                      : "bg-green-50 text-green-700"
                  }`}
                >
                  Thanks for subscribing! Check your email for confirmation.
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  checked={theme === "dark"}
                  onCheckedChange={(checked) =>
                    setTheme(checked ? "dark" : "light")
                  }
                />
                <span className="text-sm">Dark mode</span>
              </div>
            </form>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Shop</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`flex items-center gap-2 text-sm hover:opacity-75 transition-opacity ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    <ChevronRight className="w-3 h-3" />
                    {link.label}
                    {link.badge && (
                      <Badge variant="destructive" className="ml-2 text-xs">
                        {link.badge}
                      </Badge>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-sm hover:opacity-75 transition-opacity ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-sm hover:opacity-75 transition-opacity ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand & Contact */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
              <div
                className={`w-8 h-8 rounded-full ${
                  theme === "dark" ? "bg-blue-500" : "bg-blue-600"
                }`}
              ></div>
              <span className="text-xl font-bold">NEXTSHOP</span>
            </div>

            <div
              className={`flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              <div className="flex items-center gap-2">
                <Phone className="w-3 h-3" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3" />
                <span>support@nextshop.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                <span>New York, NY</span>
              </div>
            </div>
          </div>

          {/* Social & Payment */}
          <div className="flex flex-col items-center md:items-end gap-4">
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <Button
                  key={social.label}
                  variant="ghost"
                  size="icon"
                  className={`rounded-full ${
                    theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100"
                  }`}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </Button>
              ))}
            </div>

            {/* Payment Methods */}
            <div className="flex flex-wrap justify-center gap-2">
              {paymentMethods.map((method) => (
                <div
                  key={method}
                  className={`px-3 py-1 rounded text-xs font-medium ${
                    theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                  }`}
                >
                  {method}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div
          className={`mt-8 pt-6 border-t text-center text-sm ${
            theme === "dark"
              ? "text-gray-500 border-gray-800"
              : "text-gray-400 border-gray-200"
          }`}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© {new Date().getFullYear()} NextShop. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:underline">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:underline">
                Terms of Service
              </Link>
              <Link href="/cookies" className="hover:underline">
                Cookie Policy
              </Link>
              <Link href="/sitemap" className="hover:underline">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
