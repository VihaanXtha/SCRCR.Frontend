
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
    data: {
      url: targetUrl,
      ...payload.data
    }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  const url = (event.notification && event.notification.data && event.notification.data.url) || '/';
  event.notification.close();
  event.waitUntil(clients.openWindow(url));
});
