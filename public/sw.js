self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon.png',
      badge: '/icon.png',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/dashboard?tab=nachrichten'
      },
      actions: [
        { action: 'open', title: 'Ansehen' },
        { action: 'close', title: 'Schließen' }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );

    // Update App Badge if supported
    if ('setAppBadge' in navigator) {
      navigator.setAppBadge(data.badgeCount || 1).catch(err => {
        console.error('Error setting badge:', err);
      });
    }
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'close') return;

  const urlToOpen = new URL(event.notification.data.url, self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      // Check if there is already a window open with this URL
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // If no window found, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// App Badge clearing logic (can also be handled in the main app)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_BADGE') {
    if ('clearAppBadge' in navigator) {
      navigator.clearAppBadge().catch(err => console.error('Error clearing badge:', err));
    }
  }
});
