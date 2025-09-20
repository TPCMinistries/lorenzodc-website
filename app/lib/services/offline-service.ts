'use client';

// Offline Service for PWA functionality
class OfflineService {
  private dbName = 'CatalystAI_OfflineDB';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  // Initialize IndexedDB for offline storage
  async initialize(): Promise<boolean> {
    if (!('indexedDB' in window)) {
      console.warn('IndexedDB not supported');
      return false;
    }

    try {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, this.dbVersion);

        request.onerror = () => {
          console.error('Failed to open IndexedDB');
          reject(false);
        };

        request.onsuccess = () => {
          this.db = request.result;
          console.log('IndexedDB initialized successfully');
          resolve(true);
        };

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;

          // Create object stores for offline data
          if (!db.objectStoreNames.contains('chatHistory')) {
            const chatStore = db.createObjectStore('chatHistory', { keyPath: 'id', autoIncrement: true });
            chatStore.createIndex('userId', 'userId', { unique: false });
            chatStore.createIndex('timestamp', 'timestamp', { unique: false });
          }

          if (!db.objectStoreNames.contains('goals')) {
            const goalsStore = db.createObjectStore('goals', { keyPath: 'id' });
            goalsStore.createIndex('userId', 'userId', { unique: false });
          }

          if (!db.objectStoreNames.contains('assessments')) {
            const assessmentsStore = db.createObjectStore('assessments', { keyPath: 'id' });
            assessmentsStore.createIndex('userId', 'userId', { unique: false });
          }

          if (!db.objectStoreNames.contains('documents')) {
            const documentsStore = db.createObjectStore('documents', { keyPath: 'id' });
            documentsStore.createIndex('userId', 'userId', { unique: false });
          }

          if (!db.objectStoreNames.contains('userPreferences')) {
            db.createObjectStore('userPreferences', { keyPath: 'userId' });
          }

          console.log('IndexedDB object stores created');
        };
      });
    } catch (error) {
      console.error('Error initializing offline service:', error);
      return false;
    }
  }

  // Save chat history for offline access
  async saveChatHistory(chat: any): Promise<boolean> {
    if (!this.db) return false;

    try {
      const transaction = this.db.transaction(['chatHistory'], 'readwrite');
      const store = transaction.objectStore('chatHistory');

      const chatData = {
        ...chat,
        timestamp: new Date().toISOString(),
        synced: false
      };

      await store.add(chatData);
      return true;
    } catch (error) {
      console.error('Error saving chat history:', error);
      return false;
    }
  }

  // Get offline chat history
  async getChatHistory(userId: string, limit: number = 50): Promise<any[]> {
    if (!this.db) return [];

    try {
      return new Promise((resolve) => {
        const transaction = this.db!.transaction(['chatHistory'], 'readonly');
        const store = transaction.objectStore('chatHistory');
        const index = store.index('userId');
        const request = index.getAll(userId);

        request.onsuccess = () => {
          const results = request.result
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, limit);
          resolve(results);
        };

        request.onerror = () => {
          console.error('Error fetching chat history');
          resolve([]);
        };
      });
    } catch (error) {
      console.error('Error getting chat history:', error);
      return [];
    }
  }

  // Save goals for offline access
  async saveGoals(goals: any[]): Promise<boolean> {
    if (!this.db) return false;

    try {
      const transaction = this.db.transaction(['goals'], 'readwrite');
      const store = transaction.objectStore('goals');

      for (const goal of goals) {
        await store.put({
          ...goal,
          lastSync: new Date().toISOString()
        });
      }

      return true;
    } catch (error) {
      console.error('Error saving goals:', error);
      return false;
    }
  }

  // Get offline goals
  async getGoals(userId: string): Promise<any[]> {
    if (!this.db) return [];

    try {
      return new Promise((resolve) => {
        const transaction = this.db!.transaction(['goals'], 'readonly');
        const store = transaction.objectStore('goals');
        const index = store.index('userId');
        const request = index.getAll(userId);

        request.onsuccess = () => {
          resolve(request.result || []);
        };

        request.onerror = () => {
          console.error('Error fetching goals');
          resolve([]);
        };
      });
    } catch (error) {
      console.error('Error getting goals:', error);
      return [];
    }
  }

  // Save assessment results
  async saveAssessment(assessment: any): Promise<boolean> {
    if (!this.db) return false;

    try {
      const transaction = this.db.transaction(['assessments'], 'readwrite');
      const store = transaction.objectStore('assessments');

      await store.put({
        ...assessment,
        savedOffline: true,
        lastSync: new Date().toISOString()
      });

      return true;
    } catch (error) {
      console.error('Error saving assessment:', error);
      return false;
    }
  }

  // Get offline assessments
  async getAssessments(userId: string): Promise<any[]> {
    if (!this.db) return [];

    try {
      return new Promise((resolve) => {
        const transaction = this.db!.transaction(['assessments'], 'readonly');
        const store = transaction.objectStore('assessments');
        const index = store.index('userId');
        const request = index.getAll(userId);

        request.onsuccess = () => {
          resolve(request.result || []);
        };

        request.onerror = () => {
          console.error('Error fetching assessments');
          resolve([]);
        };
      });
    } catch (error) {
      console.error('Error getting assessments:', error);
      return [];
    }
  }

  // Save user preferences
  async saveUserPreferences(userId: string, preferences: any): Promise<boolean> {
    if (!this.db) return false;

    try {
      const transaction = this.db.transaction(['userPreferences'], 'readwrite');
      const store = transaction.objectStore('userPreferences');

      await store.put({
        userId,
        ...preferences,
        lastUpdated: new Date().toISOString()
      });

      return true;
    } catch (error) {
      console.error('Error saving user preferences:', error);
      return false;
    }
  }

  // Get user preferences
  async getUserPreferences(userId: string): Promise<any | null> {
    if (!this.db) return null;

    try {
      return new Promise((resolve) => {
        const transaction = this.db!.transaction(['userPreferences'], 'readonly');
        const store = transaction.objectStore('userPreferences');
        const request = store.get(userId);

        request.onsuccess = () => {
          resolve(request.result || null);
        };

        request.onerror = () => {
          console.error('Error fetching user preferences');
          resolve(null);
        };
      });
    } catch (error) {
      console.error('Error getting user preferences:', error);
      return null;
    }
  }

  // Sync offline data when connection is restored
  async syncOfflineData(): Promise<void> {
    if (!this.db || !navigator.onLine) return;

    try {
      console.log('Starting offline data sync...');

      // Sync chat history
      const unsynced = await this.getUnsyncedChats();
      for (const chat of unsynced) {
        // Here you would send to your API
        console.log('Syncing chat:', chat.id);
        // Mark as synced after successful API call
        await this.markChatAsSynced(chat.id);
      }

      console.log('Offline data sync completed');
    } catch (error) {
      console.error('Error syncing offline data:', error);
    }
  }

  // Get unsynced chats
  private async getUnsyncedChats(): Promise<any[]> {
    if (!this.db) return [];

    return new Promise((resolve) => {
      const transaction = this.db!.transaction(['chatHistory'], 'readonly');
      const store = transaction.objectStore('chatHistory');
      const request = store.getAll();

      request.onsuccess = () => {
        const unsynced = request.result.filter(chat => !chat.synced);
        resolve(unsynced);
      };

      request.onerror = () => {
        resolve([]);
      };
    });
  }

  // Mark chat as synced
  private async markChatAsSynced(chatId: number): Promise<void> {
    if (!this.db) return;

    const transaction = this.db.transaction(['chatHistory'], 'readwrite');
    const store = transaction.objectStore('chatHistory');
    const request = store.get(chatId);

    request.onsuccess = () => {
      const chat = request.result;
      if (chat) {
        chat.synced = true;
        store.put(chat);
      }
    };
  }

  // Clear all offline data (for privacy/logout)
  async clearOfflineData(): Promise<boolean> {
    if (!this.db) return false;

    try {
      const storeNames = ['chatHistory', 'goals', 'assessments', 'documents', 'userPreferences'];
      const transaction = this.db.transaction(storeNames, 'readwrite');

      for (const storeName of storeNames) {
        const store = transaction.objectStore(storeName);
        await store.clear();
      }

      console.log('All offline data cleared');
      return true;
    } catch (error) {
      console.error('Error clearing offline data:', error);
      return false;
    }
  }

  // Check if the app is running in standalone mode (installed as PWA)
  isStandalone(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone ||
           document.referrer.includes('android-app://');
  }

  // Check online status
  isOnline(): boolean {
    return navigator.onLine;
  }

  // Set up online/offline event listeners
  setupConnectionListeners(): void {
    window.addEventListener('online', () => {
      console.log('Connection restored');
      this.syncOfflineData();
    });

    window.addEventListener('offline', () => {
      console.log('Connection lost - switching to offline mode');
    });
  }

  // Get storage usage information
  async getStorageInfo(): Promise<{used: number, quota: number} | null> {
    if ('navigator' in window && 'storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        return {
          used: estimate.usage || 0,
          quota: estimate.quota || 0
        };
      } catch (error) {
        console.error('Error getting storage estimate:', error);
      }
    }
    return null;
  }
}

// Create singleton instance
const offlineService = new OfflineService();

// Auto-initialize when imported (but only after component mount)
let isInitialized = false;
export const initializeOfflineService = async () => {
  if (typeof window !== 'undefined' && !isInitialized) {
    isInitialized = true;
    const success = await offlineService.initialize();
    if (success) {
      offlineService.setupConnectionListeners();
    }
    return success;
  }
  return false;
};

export default offlineService;