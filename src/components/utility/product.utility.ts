// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Country utility functions
export const countryCodes: Record<string, string> = {
  USA: "US",
  "United States": "US",
  "United Kingdom": "GB",
  UK: "GB",
  Canada: "CA",
  Australia: "AU",
  Germany: "DE",
  France: "FR",
  Italy: "IT",
  Spain: "ES",
  Japan: "JP",
  China: "CN",
  India: "IN",
  Brazil: "BR",
  Mexico: "MX",
  "South Korea": "KR",
  Netherlands: "NL",
  Switzerland: "CH",
  Sweden: "SE",
  Norway: "NO",
  Denmark: "DK",
  Finland: "FI",
  // Add more as needed
};

export function getCountryFlagEmoji(countryName: string | null): string {
  if (!countryName) return "🌍";

  const code = countryCodes[countryName];
  if (!code) return "🌍";

  return code
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

export function getCountryCode(countryName: string | null): string {
  if (!countryName) return "";
  return countryCodes[countryName] || "";
}
