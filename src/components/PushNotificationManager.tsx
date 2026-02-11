import { useEffect } from 'react'
import { requestPermissionAndToken, attachForegroundHandler } from '../firebase'

const VAPID_PUBLIC_KEY = 'BHKnV6TV1pUNOtf3yuesnZHzZegXRAMxlVJMtrSUgJKiTvPDwF17XP8pk0ZbSGWBrmYd6CQCuSZVnO-FUrA728c'
const API_BASE = (import.meta as any).env?.VITE_API_BASE || 'https://scrcr-backend.vercel.app'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

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

  const subscribeUser = async (_registration: ServiceWorkerRegistration) => {}

  return null;
}
