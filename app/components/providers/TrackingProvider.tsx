'use client';

import { useEffect } from 'react';
import Script from 'next/script';

interface TrackingProviderProps {
  children: React.ReactNode;
  facebookPixelId?: string;
  googleAnalyticsId?: string;
  linkedInInsightId?: string;
}

export default function TrackingProvider({
  children,
  facebookPixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID,
  googleAnalyticsId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  linkedInInsightId = process.env.NEXT_PUBLIC_LINKEDIN_INSIGHT_ID
}: TrackingProviderProps) {
  useEffect(() => {
    // Initialize Facebook Pixel
    if (facebookPixelId && typeof window !== 'undefined') {
      (function(f: any, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function() {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

      (window as any).fbq('init', facebookPixelId);
      (window as any).fbq('track', 'PageView');
    }

    // Initialize LinkedIn Insight Tag
    if (linkedInInsightId && typeof window !== 'undefined') {
      (window as any)._linkedin_partner_id = linkedInInsightId;
      (window as any)._linkedin_data_partner_ids = (window as any)._linkedin_data_partner_ids || [];
      (window as any)._linkedin_data_partner_ids.push(linkedInInsightId);

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js';
      document.getElementsByTagName('head')[0].appendChild(script);
    }
  }, [facebookPixelId, linkedInInsightId]);

  return (
    <>
      {/* Google Analytics */}
      {googleAnalyticsId && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${googleAnalyticsId}', {
                  page_title: document.title,
                  page_location: window.location.href,
                });
              `,
            }}
          />
        </>
      )}

      {/* Facebook Pixel noscript fallback */}
      {facebookPixelId && (
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${facebookPixelId}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      )}

      {/* LinkedIn noscript fallback */}
      {linkedInInsightId && (
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            alt=""
            src={`https://px.ads.linkedin.com/collect/?pid=${linkedInInsightId}&fmt=gif`}
          />
        </noscript>
      )}

      {children}
    </>
  );
}