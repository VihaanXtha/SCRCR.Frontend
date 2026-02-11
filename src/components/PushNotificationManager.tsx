import { useEffect } from 'react'
import { requestPermissionAndToken, attachForegroundHandler } from '../firebase'

const API_BASE = (import.meta as any).env?.VITE_API_BASE || 'https://scrcr-backend.vercel.app'

export default function PushNotificationManager() {
  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) {
        return;
    }

    const registerSw = async () => {
        try {
            await navigator.serviceWorker.register('/sw.js');
            attachForegroundHandler();
            const token = await requestPermissionAndToken();
            if (token) {
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

    registerSw();

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

  return null;
}
