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
      const notification = payload.notification || {}
      const data = payload.data || {}
      
      const title = notification.title || data.title || 'Notification'
      const options = {
        body: notification.body || data.body || '',
        icon: notification.icon || '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        image: notification.image || data.image,
        vibrate: [200, 100, 200],
        requireInteraction: true,
        actions: [
          { action: 'view', title: 'View' },
          { action: 'dismiss', title: 'Dismiss' }
        ],
        data: { 
          url: data.url || notification.click_action || '/',
          ...data 
        }
      }

      self.registration.showNotification(title, options)
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
  event.notification.close()

  if (event.action === 'dismiss') {
    return
  }

  const url =
    (event.notification && event.notification.data && event.notification.data.url) || '/'
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (windowClients) {
      // Check if there is already a window/tab open with the target URL
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i]
        // If url matches roughly, focus it
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus()
        }
      }
      // If not, open a new window
      if (clients.openWindow) {
        return clients.openWindow(url)
      }
    })
  )
})
