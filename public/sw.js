// Service Worker Version: 2.1.3 (Final Stability Fix)
/* eslint-disable no-restricted-globals */

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// CRITICAL for iOS Safari: Must have a fetch handler
self.addEventListener('fetch', (event) => {
  return;
});

self.addEventListener('push', (event) => {
  console.log('[SW] Push received');

  let title = 'FMSC Portal ✈️';
  let body = 'Neue Nachricht erhalten!';
  let icon = '/icon.png';
  let tag = 'fmsc-notification';
  let url = '/dashboard?tab=nachrichten';
  let vibrate = [200, 100, 200];
  let badgeCount = 1;

  if (event.data) {
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
      console.warn('[SW] Parsing payload failed, using text fallback');
      body = event.data.text() || body;
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

  if ('setAppBadge' in self.navigator) {
    self.navigator.setAppBadge(badgeCount).catch(() => {});
  }

  event.waitUntil(notificationPromise);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'close') return;

  let urlToOpen = new URL('/', self.location.origin).href;
  if (event.notification.data && event.notification.data.url) {
    urlToOpen = new URL(event.notification.data.url, self.location.origin).href;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(urlToOpen);
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_BADGE') {
    if ('clearAppBadge' in navigator) {
      navigator.clearAppBadge().catch(() => {});
    }
  }
});
