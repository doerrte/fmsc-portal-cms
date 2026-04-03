self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// CRITICAL for iOS Safari: Must have a fetch handler to be considered a functional PWA
self.addEventListener('fetch', (event) => {
  // We don't need to cache anything yet, just proof of life
  return;
});

self.addEventListener('push', function(event) {
  if (event.data) {
    let data;
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'FMSC Nachricht', body: event.data.text() };
    }

    const title = data.title || 'FMSC Portal ✈️';
    try {
      const data = event.data.json();
      title = data.title || title;
      body = data.body || body;
      icon = data.icon || icon;
      tag = data.tag || tag;
      url = data.url || url;
      vibrate = data.vibrate || vibrate;
      badgeCount = data.badgeCount !== undefined ? data.badgeCount : badgeCount;
    } catch (e) {
      console.error('[SW] JSON parse error, using fallback notification:', e);
      // Fallback: title and body are already set to defaults above
    }
  }

  const notificationPromise = self.registration.showNotification(title, {
    body,
    icon,
    badge: '/badge.png',
    tag,
    renotify: true,
    data: { url },
    actions: [
      { action: 'open', title: 'Ansehen' },
      { action: 'close', title: 'Schließen' }
    ],
    vibrate
  });

  // Badge Update
  if ('setAppBadge' in self.navigator) {
    self.navigator.setAppBadge(badgeCount).catch(err => console.log('Badge error:', err));
  }

  event.waitUntil(notificationPromise);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'close') return;

  // Default behavior or 'view' action
  let urlToOpen = new URL('/', self.location.origin).href;
  if (event.notification.data && event.notification.data.url) {
    try {
      urlToOpen = new URL(event.notification.data.url, self.location.origin).href;
    } catch (e) {
      console.warn('Malformed notification URL');
    }
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // If a window is already open at this URL, focus it
      for (let client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise, open a new window
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
