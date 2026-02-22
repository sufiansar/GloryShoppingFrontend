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

interface NewsletterData {
  email: string;
  subscribed: boolean;
}

const Footer = () => {
  const [newsletter, setNewsletter] = useState<NewsletterData>({
    email: "",
    subscribed: false,
  });

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
    { label: "New Arrivals", href: "/" },
    { label: "Best Sellers", href: "/" },
    { label: "Sale", href: "/", badge: "HOT" },
    { label: "Limited Edition", href: "/" },
  ];

  const supportLinks = [
    { label: "Contact Us", href: "#" },
    { label: "FAQ", href: "#" },
    { label: "Shipping Info", href: "#" },
    { label: "Returns & Exchanges", href: "#" },
    { label: "Size Guide", href: "#" },
  ];

  const companyLinks = [
    { label: "About Us", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
    { label: "Sustainability", href: "#" },
    { label: "Store Locator", href: "#" },
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
    <footer className="relative bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        {/* Top Section - Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {trustBadges.map((badge, index) => (
            <div
              key={index}
              className="flex items-center justify-center gap-3 p-4 rounded-xl bg-gray-50 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 border border-gray-100"
            >
              <badge.icon className="w-6 h-6 text-[#ca428b]" />
              <span className="font-medium text-sm text-gray-700">
                {badge.label}
              </span>
            </div>
          ))}
        </div>

        <Separator className="my-8 bg-gray-200" />

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Newsletter Column */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2 text-gray-800">
                Stay Updated
              </h2>
              <p className="text-sm text-gray-600">
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
                  className="flex-1 bg-white text-gray-900 border-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-[#ca428b] focus:border-transparent"
                  required
                />
                <Button
                  type="submit"
                  className="gap-2 bg-[#ca428b] text-white hover:bg-[#b03a7a] hover:scale-105 transition-all duration-300 font-semibold"
                >
                  <Send className="w-4 h-4" />
                  Join
                </Button>
              </div>

              {newsletter.subscribed && (
                <div className="p-3 rounded-lg bg-green-50 text-green-700 border border-green-200">
                  Thanks for subscribing! Check your email for confirmation.
                </div>
              )}
            </form>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-800 relative inline-block">
              Shop
              <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-[#ca428b] rounded-full"></span>
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#ca428b] transition-all hover:translate-x-1"
                  >
                    <ChevronRight className="w-3 h-3 text-[#ca428b]" />
                    {link.label}
                    {link.badge && (
                      <Badge
                        variant="destructive"
                        className="ml-2 text-xs bg-red-500 hover:bg-red-600"
                      >
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
            <h3 className="font-bold text-lg mb-4 text-gray-800 relative inline-block">
              Support
              <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-[#ca428b] rounded-full"></span>
            </h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-[#ca428b] transition-all hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-800 relative inline-block">
              Company
              <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-[#ca428b] rounded-full"></span>
            </h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-[#ca428b] transition-all hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-gray-200" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand & Contact */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-linear-to-r from-[#ca428b] to-[#a52a6e] flex items-center justify-center text-white font-bold text-xl shadow-lg">
                GS
              </div>
              <span className="text-2xl font-bold text-gray-800">
                Glory Shopping BD
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2 hover:text-[#ca428b] transition-colors">
                <Phone className="w-3 h-3" />
                <span>+8801577437554</span>
              </div>
              <div className="flex items-center gap-2 hover:text-[#ca428b] transition-colors">
                <Mail className="w-3 h-3" />
                <span>gloryshopingbd@gmail.com</span>
              </div>
              <div className="flex items-center gap-2 hover:text-[#ca428b] transition-colors">
                <MapPin className="w-3 h-3" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>

          {/* Social & Payment */}
          <div className="flex flex-col items-center md:items-end gap-4">
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <Button
                  key={social.label}
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-[#ca428b] hover:text-white transition-all duration-300 border border-gray-300 text-gray-600"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </Button>
              ))}
            </div>

            {/* Payment Methods */}
            <div className="flex flex-wrap justify-center gap-2">
              {paymentMethods.map((method) => (
                <div
                  key={method}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200 hover:bg-[#ca428b] hover:text-white transition-colors cursor-default"
                >
                  {method}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p>
              © {new Date().getFullYear()} Glory Shopping BD. All rights
              reserved.
            </p>
            <p>
              Designed and developed by{" "}
              <Link
                href="
                https://www.mdabusufian.me"
                className="text-[#ca428b] hover:underline transition-colors font-medium"
              >
                Md. Abu sufian
              </Link>
              .
            </p>
            <div className="flex gap-6">
              <Link
                href="#"
                className="hover:text-[#ca428b] hover:underline transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="hover:text-[#ca428b] hover:underline transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="hover:text-[#ca428b] hover:underline transition-colors"
              >
                Cookie Policy
              </Link>
              <Link
                href="#"
                className="hover:text-[#ca428b] hover:underline transition-colors"
              >
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
