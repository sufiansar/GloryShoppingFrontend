"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { trackPageView } from "@/lib/gtm";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const GTM_SERVER_URL = process.env.NEXT_PUBLIC_GTM_SERVER_URL
  ? process.env.NEXT_PUBLIC_GTM_SERVER_URL.replace(/\/$/, "")
  : "https://www.googletagmanager.com";

/**
 * Component to track pageviews automatically on SPA route changes
 */
const GTMPageViewListener = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GTM_ID) return;

    const url = searchParams?.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    trackPageView(url);
  }, [pathname, searchParams]);

  return null;
};

/**
 * Google Tag Manager component for tracking with Server-Side GTM support.
 */
export const GoogleTagManager = () => {
  if (!GTM_ID) return null;

  return (
    <>
      <Suspense fallback={null}>
        <GTMPageViewListener />
      </Suspense>
      {/* Google Tag Manager - Script */}
      <Script
        id="gtm-script"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `,
        }}
      />
      {/* Google Tag Manager (noscript) - Fallback inside body */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
    </>
  );
};
