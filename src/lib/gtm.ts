"use client";

// Define DataLayer item and event types for GA4 & GTM E-commerce standard
export interface GTMItem {
  item_id: string;
  item_name: string;
  price?: number;
  item_category?: string;
  item_brand?: string;
  item_variant?: string;
  quantity?: number;
}

export interface GTMPurchaseDetails {
  transaction_id: string;
  value: number;
  tax?: number;
  shipping?: number;
  currency?: string;
  items: GTMItem[];
  user_email?: string;
  user_phone?: string;
}

declare global {
  interface Window {
    dataLayer: Record<string, any>[];
  }
}

/**
 * Utility to push generic data / events into window.dataLayer
 */
export const sendGTMEvent = (event: string, data: Record<string, any> = {}) => {
  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event,
      ...data,
    });
  }
};

/**
 * Track SPA Route change / PageView
 */
export const trackPageView = (url: string, pageTitle?: string) => {
  sendGTMEvent("page_view", {
    page_location: typeof window !== "undefined" ? window.location.href : url,
    page_path: url,
    page_title: pageTitle || (typeof document !== "undefined" ? document.title : ""),
  });
};

/**
 * Track GA4 view_item event
 */
export const trackViewItem = (item: GTMItem, currency: string = "BDT") => {
  sendGTMEvent("view_item", {
    ecommerce: {
      currency,
      value: item.price || 0,
      items: [item],
    },
  });
};

/**
 * Track GA4 add_to_cart event
 */
export const trackAddToCart = (item: GTMItem, currency: string = "BDT") => {
  sendGTMEvent("add_to_cart", {
    ecommerce: {
      currency,
      value: (item.price || 0) * (item.quantity || 1),
      items: [item],
    },
  });
};

/**
 * Track GA4 remove_from_cart event
 */
export const trackRemoveFromCart = (item: GTMItem, currency: string = "BDT") => {
  sendGTMEvent("remove_from_cart", {
    ecommerce: {
      currency,
      value: (item.price || 0) * (item.quantity || 1),
      items: [item],
    },
  });
};

/**
 * Track GA4 begin_checkout event
 */
export const trackBeginCheckout = (items: GTMItem[], totalValue: number, currency: string = "BDT") => {
  sendGTMEvent("begin_checkout", {
    ecommerce: {
      currency,
      value: totalValue,
      items,
    },
  });
};

/**
 * Track GA4 purchase event
 */
export const trackPurchase = (details: GTMPurchaseDetails) => {
  sendGTMEvent("purchase", {
    ecommerce: {
      transaction_id: details.transaction_id,
      value: details.value,
      tax: details.tax || 0,
      shipping: details.shipping || 0,
      currency: details.currency || "BDT",
      items: details.items,
    },
    user_data: {
      email: details.user_email || "",
      phone_number: details.user_phone || "",
    },
  });
};
