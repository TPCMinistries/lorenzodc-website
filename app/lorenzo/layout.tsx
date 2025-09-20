import "../globals.css";
import React from "react";
import PWAInstallButton, { PWAInstallBanner } from "../components/PWAInstallButton";
import { ConnectionIndicator } from "../components/PWAStatus";
import GlobalNavigation from "../components/GlobalNavigation";

export const metadata = {
  title: "Lorenzo Daughtry-Chambers — Divine Strategy & AI Innovation",
  description: "Transforming visionary leaders through prophetic intelligence, AI innovation, and kingdom-aligned strategy.",
};

export default function LorenzoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* PWA Meta Tags */}
        <meta name="application-name" content="Lorenzo Daughtry-Chambers" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Lorenzo Daughtry-Chambers" />
        <meta name="description" content="Transforming visionary leaders through prophetic intelligence, AI innovation, and kingdom-aligned strategy" />
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
        <meta name="twitter:url" content="https://lorenzo.com" />
        <meta name="twitter:title" content="Lorenzo Daughtry-Chambers - Divine Strategy & AI Innovation" />
        <meta name="twitter:description" content="Transforming visionary leaders through prophetic intelligence, AI innovation, and kingdom-aligned strategy" />
        <meta name="twitter:image" content="/icons/icon-192x192.png" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="Lorenzo Daughtry-Chambers - Divine Strategy & AI Innovation" />
        <meta property="og:description" content="Transforming visionary leaders through prophetic intelligence, AI innovation, and kingdom-aligned strategy" />
        <meta property="og:site_name" content="Lorenzo Daughtry-Chambers" />
        <meta property="og:url" content="https://lorenzo.com" />
        <meta property="og:image" content="/icons/icon-512x512.png" />
      </head>
      <body>
        <ConnectionIndicator />
        <GlobalNavigation />
        <main className="pt-24 pb-24">{children}</main>
        <PWAInstallBanner />

        <footer className="border-t border-slate-800 bg-slate-900">
          <div className="container mx-auto px-4 py-10 text-sm text-slate-400">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <p>© {new Date().getFullYear()} Lorenzo Daughtry-Chambers. Built with divine purpose & strategic excellence.</p>
              <div className="flex gap-6">
                <a href="/privacy" className="hover:text-white">Privacy</a>
                <a href="/terms" className="hover:text-white">Terms</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}