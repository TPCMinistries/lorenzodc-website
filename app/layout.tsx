// app/layout.tsx
import "./globals.css";
import React from "react";
import PWAInstallButton, { PWAInstallBanner } from "./components/PWAInstallButton";
import { ConnectionIndicator } from "./components/PWAStatus";
import GlobalNavigation from "./components/GlobalNavigation";
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

        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180x180.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-167x167.png" />

        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#3B82F6" />
        <link rel="shortcut icon" href="/favicon.ico" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://catalyst-ai.com" />
        <meta name="twitter:title" content="Catalyst AI - Enterprise AI Platform" />
        <meta name="twitter:description" content="Transform your business with AI-powered coaching, goal tracking, and enterprise solutions" />
        <meta name="twitter:image" content="/icons/icon-192x192.png" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="Catalyst AI - Enterprise AI Platform" />
        <meta property="og:description" content="Transform your business with AI-powered coaching, goal tracking, and enterprise solutions" />
        <meta property="og:site_name" content="Catalyst AI" />
        <meta property="og:url" content="https://catalyst-ai.com" />
        <meta property="og:image" content="/icons/icon-512x512.png" />

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
        <GlobalNavigation />

        <main className="pt-24 pb-24">{children}</main>

        <PWAInstallBanner />

        <footer className="border-t border-slate-800 bg-slate-900">
          <div className="container mx-auto px-4 py-10 text-sm text-slate-400">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <p>© {new Date().getFullYear()} The Catalyst Path. Built with integrity &amp; foresight.</p>
              <div className="flex gap-6">
                <a href="/privacy" className="hover:text-white">Privacy</a>
                <a href="/terms" className="hover:text-white">Terms</a>
              </div>
            </div>
          </div>
        </footer>

        {/* </TrackingProvider> */}
      </body>
    </html>
  );
}