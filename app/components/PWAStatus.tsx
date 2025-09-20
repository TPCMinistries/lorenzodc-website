'use client';

import { useState, useEffect } from 'react';
import offlineService, { initializeOfflineService } from '../lib/services/offline-service';

export default function PWAStatus() {
  const [isStandalone, setIsStandalone] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [storageInfo, setStorageInfo] = useState<{used: number, quota: number} | null>(null);

  useEffect(() => {
    // Initialize offline service first
    initializeOfflineService().then(() => {
      // Check PWA status
      setIsStandalone(offlineService.isStandalone());
      setIsOnline(offlineService.isOnline());

      // Get storage info
      offlineService.getStorageInfo().then(setStorageInfo);
    });

    // Set up connection listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span>📱</span>
        App Status
      </h3>

      <div className="space-y-4">
        {/* Installation Status */}
        <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
          <div>
            <p className="font-medium text-white">App Installation</p>
            <p className="text-sm text-slate-400">
              {isStandalone ? 'Installed as app' : 'Running in browser'}
            </p>
          </div>
          <div className={`text-2xl ${isStandalone ? 'text-green-400' : 'text-yellow-400'}`}>
            {isStandalone ? '📲' : '🌐'}
          </div>
        </div>

        {/* Connection Status */}
        <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
          <div>
            <p className="font-medium text-white">Connection</p>
            <p className="text-sm text-slate-400">
              {isOnline ? 'Online' : 'Offline mode'}
            </p>
          </div>
          <div className={`text-2xl ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
            {isOnline ? '📶' : '📵'}
          </div>
        </div>

        {/* Storage Information */}
        {storageInfo && (
          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
            <div>
              <p className="font-medium text-white">Offline Storage</p>
              <p className="text-sm text-slate-400">
                {formatBytes(storageInfo.used)} used of {formatBytes(storageInfo.quota)}
              </p>
            </div>
            <div className="text-2xl text-blue-400">💾</div>
          </div>
        )}

        {/* PWA Features */}
        <div className="mt-6">
          <h4 className="font-medium text-white mb-3">Available Features</h4>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center gap-3 text-sm">
              <span className="text-green-400">✓</span>
              <span className="text-slate-300">Offline chat history access</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-green-400">✓</span>
              <span className="text-slate-300">Goal tracking offline</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-green-400">✓</span>
              <span className="text-slate-300">Assessment results cached</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-green-400">✓</span>
              <span className="text-slate-300">Auto-sync when online</span>
            </div>
            {isStandalone && (
              <>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-green-400">✓</span>
                  <span className="text-slate-300">Home screen shortcut</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-green-400">✓</span>
                  <span className="text-slate-300">Full-screen experience</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-slate-600">
          {!isStandalone && (
            <button
              onClick={() => {
                if ((window as any).promptPWAInstall) {
                  (window as any).promptPWAInstall();
                }
              }}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:from-blue-400 hover:to-purple-400 transition-colors"
            >
              Install App
            </button>
          )}

          <button
            onClick={() => offlineService.clearOfflineData()}
            className="px-4 py-2 bg-slate-600 text-slate-300 rounded-lg text-sm hover:bg-slate-500 transition-colors"
          >
            Clear Cache
          </button>
        </div>
      </div>
    </div>
  );
}

// Connection indicator component for mobile
export function ConnectionIndicator() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white text-center py-2 text-sm">
      <div className="flex items-center justify-center gap-2">
        <span>📵</span>
        <span>Offline Mode - Some features may be limited</span>
      </div>
    </div>
  );
}