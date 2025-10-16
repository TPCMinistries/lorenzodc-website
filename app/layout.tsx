// app/layout.tsx
import "./globals.css";
import React from "react";
import PWAInstallButton, { PWAInstallBanner } from "./components/PWAInstallButton";
import { ConnectionIndicator } from "./components/PWAStatus";
import ExitIntentPopup from "./components/ExitIntentPopup";
import ConditionalLayout from "./components/ConditionalLayout";
// import TrackingProvider from "./components/providers/TrackingProvider";

export const metadata = {
  title: "The Catalyst Path — Futurist AI Strategy",
  description: "From first prompt to enterprise pilots: diagnostics, ROI, RAG, and a 90-day plan.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* PWA Meta Tags */}
        <meta name="application-name" content="Catalyst AI" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Catalyst AI" />
        <meta name="description" content="Transform your business with AI-powered coaching, goal tracking, and enterprise solutions" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#0F172A" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#3B82F6" />

        <link rel="apple-touch-icon" href="/favicon.ico" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://www.lorenzodc.com" />
        <meta name="twitter:title" content="The Catalyst Path — Futurist AI Strategy" />
        <meta name="twitter:description" content="From first prompt to enterprise pilots: diagnostics, ROI, RAG, and a 90-day plan." />
        <meta name="twitter:image" content="/favicon.ico" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="The Catalyst Path — Futurist AI Strategy" />
        <meta property="og:description" content="From first prompt to enterprise pilots: diagnostics, ROI, RAG, and a 90-day plan." />
        <meta property="og:site_name" content="The Catalyst Path" />
        <meta property="og:url" content="https://www.lorenzodc.com" />
        <meta property="og:image" content="/favicon.ico" />

        {/* PWA Install Prompt Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              let deferredPrompt;
              window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                deferredPrompt = e;
                console.log('PWA install prompt available');

                // Show custom install button if desired
                const installBtn = document.getElementById('pwa-install-btn');
                if (installBtn) {
                  installBtn.style.display = 'block';
                }
              });

              window.addEventListener('appinstalled', () => {
                console.log('PWA was installed');
                deferredPrompt = null;
                const installBtn = document.getElementById('pwa-install-btn');
                if (installBtn) {
                  installBtn.style.display = 'none';
                }
              });

              // Add install functionality to global scope
              window.promptPWAInstall = () => {
                if (deferredPrompt) {
                  deferredPrompt.prompt();
                  deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                      console.log('User accepted the install prompt');
                    } else {
                      console.log('User dismissed the install prompt');
                    }
                    deferredPrompt = null;
                  });
                }
              };
            `,
          }}
        />

        {/* Facebook Pixel */}
        {process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID && (
          <>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID}');
                  fbq('track', 'PageView');
                `,
              }}
            />
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: 'none' }}
                src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        )}

        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
                `,
              }}
            />
          </>
        )}

        {/* LinkedIn Insight Tag */}
        {process.env.NEXT_PUBLIC_LINKEDIN_INSIGHT_ID && (
          <>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  _linkedin_partner_id = "${process.env.NEXT_PUBLIC_LINKEDIN_INSIGHT_ID}";
                  window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
                  window._linkedin_data_partner_ids.push(_linkedin_partner_id);
                `,
              }}
            />
            <script async src="https://snap.licdn.com/li.lms-analytics/insight.min.js" />
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: 'none' }}
                alt=""
                src={`https://px.ads.linkedin.com/collect/?pid=${process.env.NEXT_PUBLIC_LINKEDIN_INSIGHT_ID}&fmt=gif`}
              />
            </noscript>
          </>
        )}
      </head>
      <body>
        {/* <TrackingProvider> */}
        <ConnectionIndicator />

        <ConditionalLayout>
          {children}
        </ConditionalLayout>

        <PWAInstallBanner />
        <ExitIntentPopup />
        {/* </TrackingProvider> */}
      </body>
    </html>
  );
}