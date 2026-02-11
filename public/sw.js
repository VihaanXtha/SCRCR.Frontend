
self.addEventListener('push', function(event) {
  if (!event.data) {
    console.log('Push event but no data');
    return;
  }
  const payload = event.data.json();
  const title = payload.title || 'Notification';
  const body = payload.body || payload.text || '';
  const targetUrl =
    (payload.url) ||
    (payload.data && payload.data.url) ||
    '/';

  const options = {
    body,
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    tag: payload.tag || 'scrcr-update',
    renotify: true,
    requireInteraction: true,
    vibrate: [100, 50, 100],
    timestamp: Date.now(),
    actions: [
      { action: 'view', title: 'View', icon: '/pwa-192x192.png' },
      { action: 'dismiss', title: 'Dismiss' }
    ],
    data: {
      url: targetUrl,
      ...payload.data
    }
  };

  event.waitUntil(
    Promise.all([
      self.registration.showNotification(title, options),
      // Broadcast to open pages for instant in-app feedback if needed
      clients.matchAll({ includeUncontrolled: true, type: 'window' }).then(cs => {
        cs.forEach(c => c.postMessage({ type: 'PUSH', payload: { title, body, url: targetUrl } }));
      })
    ])
  );
});

self.addEventListener('notificationclick', function(event) {
  const url = (event.notification && event.notification.data && event.notification.data.url) || '/';
  if (event.action === 'dismiss') {
    event.notification.close();
    return;
  }
  event.notification.close();
  event.waitUntil(clients.openWindow(url));
});
