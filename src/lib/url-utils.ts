/**
 * Utility to safely derive the Socket URL from the Base API URL
 * Handles protocol upgrades (ws -> wss) if the page is secure
 */
export function getSocketUrl(apiBaseUrl?: string): string {
  if (!apiBaseUrl) {
    return typeof window !== "undefined" && window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "";
  }

  // Remove /api/v1 or any trailing slashes to get the root domain
  let baseUrl = apiBaseUrl.replace(/\/api\/v1\/?$/, "").replace(/\/$/, "");

  // Handle protocol upgrades (ws -> wss) if the page is secure
  if (typeof window !== "undefined" && window.location.protocol === "https:") {
    if (baseUrl.startsWith("http://")) {
      console.log("🔒 Deriving secure Socket URL for HTTPS context");
      baseUrl = baseUrl.replace("http://", "https://");
    }
  }

  return baseUrl;
}
