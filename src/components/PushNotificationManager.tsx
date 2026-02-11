import { useEffect } from 'react'

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
            const registration = await navigator.serviceWorker.register('/sw.js');
            
            // Logic:
            // 1. Check if we are already granted. If so, ensure subscription is active/refreshed.
            // 2. If default (promptable), we wait for "install" signal or just ask.
            // The user said: "after the applicatin is installed ask for notificatin"
            
            // Check if app is installed (standalone mode)
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;

            if (Notification.permission === 'granted') {
                subscribeUser(registration);
            } else if (Notification.permission === 'default' && isStandalone) {
                // If installed but permission not yet decided, ask nicely.
                // We can use the Notification.requestPermission() directly or show a custom UI.
                // For simplicity and to meet the requirement, we'll request it.
                // Note: Some browsers require a user gesture. We might need a button if this fails.
                try {
                    const permission = await Notification.requestPermission();
                    if (permission === 'granted') {
                        subscribeUser(registration);
                    }
                } catch (e) {
                    console.log('Needs user gesture for notifications');
                }
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

  const subscribeUser = async (registration: ServiceWorkerRegistration) => {
      try {
          const subscription = await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
          });

          // Send subscription to backend
          // We wrap it in JSON.stringify to match the backend expectation (text column storing JSON)
          await fetch(`${API_BASE}/api/notifications/register`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ token: JSON.stringify(subscription) }),
          });
      } catch (e) {
          console.error('Failed to subscribe', e);
      }
  }

  return null;
}
