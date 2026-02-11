importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js')

try {
  const cfg = {
    apiKey: self?.VITE_FIREBASE_API_KEY,
    projectId: self?.VITE_FIREBASE_PROJECT_ID,
    messagingSenderId: self?.VITE_FIREBASE_SENDER_ID,
    appId: self?.VITE_FIREBASE_APP_ID,
  }
  if (cfg.apiKey && cfg.projectId && cfg.messagingSenderId && cfg.appId) {
    firebase.initializeApp(cfg)
  } else {
    // If config is not injected into SW, skip init gracefully
    // You must provide real Firebase config values here in production.
  }
} catch {}

let messaging
try {
  messaging = firebase.messaging()
} catch {}

if (messaging && messaging.onBackgroundMessage) {
  messaging.onBackgroundMessage((payload) => {
    const { title, body, icon } = payload.notification || {}
    self.registration.showNotification(title || 'Notification', {
      body: body || '',
      icon: icon || '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      data: { url: payload?.data?.url || '/' },
    })
  })
}

self.addEventListener('notificationclick', function (event) {
  const url =
    (event.notification && event.notification.data && event.notification.data.url) || '/'
  event.notification.close()
  event.waitUntil(clients.openWindow(url))
})
