'use client';

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export default function PWAInstallButton() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed (standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone;

    setIsInstalled(isStandalone);

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      const event = e as BeforeInstallPromptEvent;
      e.preventDefault();
      setIsInstallable(true);

      // Store the event for later use
      (window as any).deferredPrompt = event;
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setIsInstalled(true);
      setIsInstallable(false);
      (window as any).deferredPrompt = null;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    const deferredPrompt = (window as any).deferredPrompt;

    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;

      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }

      (window as any).deferredPrompt = null;
      setIsInstallable(false);
    } catch (error) {
      console.error('Error during PWA install:', error);
    }
  };

  // Don't show button if already installed or not installable
  if (isInstalled || !isInstallable) return null;

  return (
    <button
      onClick={handleInstallClick}
      className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-400 hover:to-pink-400 transition-colors shadow-lg"
      title="Install Catalyst AI as an app"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 18l9-9-2.828-2.828L12 12.343 5.828 6.171 3 9l9 9z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v14"
        />
      </svg>
      <span>Install App</span>
    </button>
  );
}

// Mobile install banner component
export function PWAInstallBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone;

    setIsInstalled(isStandalone);

    // Show banner on mobile after a delay if installable
    const timer = setTimeout(() => {
      if (!isStandalone && (window as any).deferredPrompt) {
        setShowBanner(true);
      }
    }, 3000); // Show after 3 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleInstall = async () => {
    const deferredPrompt = (window as any).deferredPrompt;

    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;

      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }

      (window as any).deferredPrompt = null;
      setShowBanner(false);
    } catch (error) {
      console.error('Error during PWA install:', error);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    // Don't show again for this session
    sessionStorage.setItem('pwa-banner-dismissed', 'true');
  };

  // Don't show if installed, not installable, or previously dismissed
  if (isInstalled || !showBanner || sessionStorage.getItem('pwa-banner-dismissed')) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 sm:hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-xl shadow-2xl border border-blue-500/20">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className="font-semibold mb-1">Install Catalyst AI</h4>
            <p className="text-sm text-blue-100">Add to your home screen for quick access</p>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={handleDismiss}
              className="p-1 hover:bg-white/20 rounded"
              aria-label="Dismiss"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <button
              onClick={handleInstall}
              className="px-3 py-1 bg-white text-blue-600 font-medium rounded-lg text-sm hover:bg-blue-50 transition-colors"
            >
              Install
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}