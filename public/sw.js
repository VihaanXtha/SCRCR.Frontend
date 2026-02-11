importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js')

let firebaseInitialized = false
let messaging

// --- Standard PWA Push Handler (Fallback / Non-Firebase) ---
self.addEventListener('push', function(event) {
  // If Firebase handles it, it might swallow the event or we might duplicate.
  // Firebase SDK usually handles 'push' internally.
  // However, we can check if it looks like a Firebase payload.
  // Firebase payloads usually have data.fcm_options or notification fields handled by SDK.
  
  // If we receive a push and Firebase isn't initialized or didn't catch it:
  if (event.data) {
    try {
      const payload = event.data.json()
      // If it has 'firebase-messaging-msg-data', it's internal to Firebase SDK.
      // We should let Firebase SDK handle it if initialized.
      
      // But if we want custom UI, we can handle it here too.
      // For now, let's allow the Firebase SDK background handler (below) to take precedence if active.
      // This listener acts as a fallback or for non-FCM pushes (e.g. direct VAPID from other sources).
      
      // If it doesn't look like an FCM internal message:
      if (!payload['firebase-messaging-msg-data'] && !payload.notification) {
          const title = payload.title || 'Notification'
          const body = payload.body || payload.text || ''
          const targetUrl = payload.url || (payload.data && payload.data.url) || '/'
          
          const options = {
            body,
            icon: '/pwa-192x192.png',
            badge: '/pwa-192x192.png',
            tag: payload.tag || 'scrcr-update',
            renotify: true,
            requireInteraction: true,
            vibrate: [100, 50, 100],
            data: { url: targetUrl, ...payload.data }
          }
          
          event.waitUntil(
            self.registration.showNotification(title, options)
          )
      }
    } catch {}
  }
})

// --- Firebase Handling ---

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

      self.registration.showNotification(title, options).then(() => {
        // Broadcast to open pages for instant feedback
        self.clients.matchAll({ includeUncontrolled: true, type: 'window' }).then(cs => {
            cs.forEach(c => c.postMessage({ 
                type: 'PUSH', 
                payload: { title, body: options.body, url: options.data.url } 
            }))
        })
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

// --- Click Handling (Unified) ---

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
