import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

function isValidConfig(cfg: any) {
  return !!(cfg?.apiKey && cfg?.projectId && cfg?.messagingSenderId && cfg?.appId)
}

let app: import('firebase/app').FirebaseApp | null = null
let messaging: import('firebase/messaging').Messaging | null = null

try {
  if (isValidConfig(firebaseConfig)) {
    app = initializeApp(firebaseConfig)
    messaging = getMessaging(app)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        const target = reg.active || navigator.serviceWorker.controller
        try {
          target?.postMessage({ type: 'INIT_FIREBASE', config: firebaseConfig })
        } catch {}
      })
    }
  } else {
    console.warn('Firebase config missing; skipping messaging init')
  }
} catch (e) {
  console.warn('Firebase init failed', e)
}

export async function requestPermissionAndToken() {
  if (!messaging) return null
  const permission = await Notification.requestPermission()
  if (permission !== 'granted') return null
  let swReg: ServiceWorkerRegistration | undefined
  try {
    // We reuse the existing registration for sw.js instead of registering firebase-messaging-sw.js
    // This prevents having two competing service workers.
    swReg = await navigator.serviceWorker.getRegistration('/sw.js')
    if (!swReg) {
      swReg = await navigator.serviceWorker.register('/sw.js')
    }
  } catch {}
  const token = await getToken(messaging, {
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration: swReg,
  })
  return token
}

export function attachForegroundHandler() {
  if (!messaging) return
  onMessage(messaging, (payload) => {
    const title = payload.notification?.title || 'Notification'
    const body = payload.notification?.body || ''
    try {
      if (Notification.permission === 'granted') {
        new Notification(title, {
          body,
          icon: '/pwa-192x192.png',
          badge: '/pwa-192x192.png',
        })
      }
    } catch {}
  })
}
