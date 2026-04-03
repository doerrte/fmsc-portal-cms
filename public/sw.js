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
  // Stage 1: Absolute proof of reception (Badge 1)
  if (self.navigator.setAppBadge) self.navigator.setAppBadge(1);

  if (event.data) {
    let data;
    try {
      data = event.data.json();
      // Stage 2: Decryption successful (Badge 2)
      if (self.navigator.setAppBadge) self.navigator.setAppBadge(2);
    } catch (e) {
      data = { title: 'FMSC Nachricht', body: event.data.text() };
    }

    const title = data.title || 'FMSC Portal ✈️';
    const body = data.body || 'Neue Nachricht!';
    
    // Notify the UI if it's open
    const channel = new BroadcastChannel('push-channel');
    channel.postMessage({ title, body });

    const options = {
      body: body,
      tag: 'fmsc-diag-tag',
      renotify: true,
      data: { url: data.url || '/' }
    };

    event.waitUntil(
      Promise.all([
        self.registration.showNotification(title, options).then(() => {
           // Stage 3: Display triggered (Badge 42)
           if (self.navigator.setAppBadge) self.navigator.setAppBadge(42);
        }).catch(err => {
          const ch = new BroadcastChannel('push-channel');
          ch.postMessage({ title: 'FEHLER', body: 'Anzeige fehlgeschlagen: ' + err.message });
        })
      ])
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'close') return;

  // Safety check for data URL
  let urlToOpen = new URL('/', self.location.origin).href;
  if (event.notification.data && event.notification.data.url) {
    try {
      urlToOpen = new URL(event.notification.data.url, self.location.origin).href;
    } catch (e) {
      console.warn('Malformed notification URL, using root');
    }
  }

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
