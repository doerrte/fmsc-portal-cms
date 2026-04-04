/**
 * FMSC Portal Service Worker - PWA Push Handler
 * Version: 2.1.4 (Audit & Safe-Catch Mode)
 */

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('push', (event) => {
  console.log('[SW] Push-Event empfangen');

  let data = {};
  
  try {
    if (event.data) {
      data = event.data.json();
    } else {
      console.warn('[SW] Push-Event ohne Daten empfangen.');
      data = { title: 'Signal empfangen 📡', body: 'Das System ist bereit.' };
    }
  } catch (err) {
    console.error('[SW] Payload-Fehler:', err);
    // CRITICAL FALLBACK: Show notification even if JSON parsing fails
    data = { 
      title: 'Benachrichtigung eingegangen 🔔', 
      body: 'Inhalt konnte nicht geladen werden, aber die Verbindung steht.',
      tag: 'fallback-notification'
    };
  }

  const options = {
    body: data.body || 'Neue Nachricht vom FMSC Portal',
    icon: '/icon.png',
    badge: '/icon.png',
    vibrate: [100, 50, 100],
    tag: data.tag || 'fmsc-notification',
    renotify: true,
    data: {
      url: data.url || '/dashboard'
    },
    number: data.badgeCount || 1
  };

  // App Badging API support (Android/Desktop)
  if ('setAppBadge' in navigator) {
    const badgeCount = data.badgeCount || 1;
    event.waitUntil(
      navigator.setAppBadge(badgeCount).catch(e => console.error(e))
    );
  }

  event.waitUntil(
    self.registration.showNotification(data.title || 'FMSC Portal', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // Clear badge when interacting with notification
  if ('clearAppBadge' in navigator) {
    navigator.clearAppBadge().catch((e) => console.error(e));
  }
  
  if (event.action === 'close') return;

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
