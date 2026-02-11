importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js')

let firebaseInitialized = false

let messaging
try {
  messaging = firebase.messaging()
} catch {}

function attachBackgroundHandler() {
  try {
    if (!messaging || !messaging.onBackgroundMessage) return
    messaging.onBackgroundMessage((payload) => {
      const { title, body, icon } = payload.notification || {}
      self.registration.showNotification(title || 'Notification', {
        body: body || '',
        icon: icon || '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        data: { url: payload?.data?.url || '/' },
      })
    })
  } catch {}
}

self.addEventListener('message', (event) => {
  try {
    const msg = event.data || {}
    if (msg.type === 'INIT_FIREBASE' && !firebaseInitialized) {
      const cfg = msg.config || {}
      if (cfg.apiKey && cfg.projectId && cfg.messagingSenderId && cfg.appId) {
        firebase.initializeApp(cfg)
        firebaseInitialized = true
        try {
          messaging = firebase.messaging()
        } catch {}
        attachBackgroundHandler()
      }
    }
  } catch {}
})

self.addEventListener('notificationclick', function (event) {
  const url =
    (event.notification && event.notification.data && event.notification.data.url) || '/'
  event.notification.close()
  event.waitUntil(clients.openWindow(url))
})
