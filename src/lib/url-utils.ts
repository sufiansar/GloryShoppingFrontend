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

  // If the current page is HTTPS but the API URL is HTTP, we need to be careful.
  // Browsers will block insecure WebSocket connections from secure pages.
  if (typeof window !== "undefined" && window.location.protocol === "https:") {
    // If the URL starts with http:// but NOT https://, try to upgrade it to https://
    // This assumes the backend supports SSL on the same host/port.
    if (baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
      console.warn("⚠️ Upgrading insecure API URL to HTTPS for secure page context");
      baseUrl = baseUrl.replace("http://", "https://");
    }
  }

  return baseUrl;
}
