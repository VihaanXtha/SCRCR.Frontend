import { useEffect, useState } from 'react'
import { requestPermissionAndToken, attachForegroundHandler } from '../firebase'

const API_BASE = (import.meta as any).env?.VITE_API_BASE || 'https://scrcr-backend.vercel.app'

export default function PushNotificationManager() {
  const [permission, setPermission] = useState(Notification.permission);

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) {
        return;
    }

    const registerSw = async () => {
        try {
            // Heads up: We use sw.js which includes Firebase logic
            await navigator.serviceWorker.register('/sw.js');
            attachForegroundHandler();
            const token = await requestPermissionAndToken();
            if (token) {
              setPermission('granted');
              await fetch(`${API_BASE}/api/notifications/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
              });
            }
        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    }

    // Auto-try if granted, otherwise wait for user action
    if (Notification.permission === 'granted') {
      registerSw();
    }

    // Heads-up: receive broadcast messages from SW for instant UI feedback
    const onMessage = (e: MessageEvent) => {
      const data = e.data;
      if (data && data.type === 'PUSH') {
        try {
          if (Notification.permission === 'granted') {
            new Notification(data.payload.title, {
              body: data.payload.body,
              icon: '/pwa-192x192.png',
              badge: '/pwa-192x192.png',
              requireInteraction: true,
              data: { url: data.payload.url }
            });
          }
        } catch {}
      }
    };
    navigator.serviceWorker.addEventListener('message', onMessage);
    return () => {
      navigator.serviceWorker.removeEventListener('message', onMessage);
    };
  }, []);

  const enableNotifications = async () => {
    const perm = await Notification.requestPermission();
    setPermission(perm);
    if (perm === 'granted') {
      const token = await requestPermissionAndToken();
      if (token) {
        await fetch(`${API_BASE}/api/notifications/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
      }
    }
  };

  if (permission === 'default') {
    return (
      <div className="fixed bottom-4 right-4 z-50 bg-white p-4 rounded-xl shadow-2xl border border-gray-100 max-w-sm animate-fade-in-up">
        <div className="flex items-start gap-3">
          <div className="bg-indigo-100 p-2 rounded-full text-indigo-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-900">Enable Notifications</h4>
            <p className="text-sm text-gray-600 mt-1">Get instant updates about news, events, and community activities.</p>
            <div className="flex gap-2 mt-3">
              <button 
                onClick={enableNotifications}
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Allow
              </button>
              <button 
                onClick={() => setPermission('denied')}
                className="px-4 py-2 text-gray-500 text-sm font-medium hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
