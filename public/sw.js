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
    const body = data.body || 'Neue Nachricht!';
    const iconUrl = new URL('/icon.png', self.location.origin).href;
    
    // Notify the UI if it's open (Foreground Alert)
    const channel = new BroadcastChannel('push-channel');
    channel.postMessage({ title, body });

    // Identify as 42 for diagnostic proof
    const options = {
      body: body,
      icon: iconUrl,
      badge: iconUrl,
      tag: 'fmsc-diag-tag',
      renotify: true
    };

    event.waitUntil(
      Promise.all([
        self.registration.showNotification(title, options).catch(err => {
          const ch = new BroadcastChannel('push-channel');
          ch.postMessage({ title: 'FEHLER', body: 'Anzeige fehlgeschlagen: ' + err.message });
        }),
        // Prove delivery by setting badge to 42
        self.navigator.setAppBadge ? self.navigator.setAppBadge(42) : Promise.resolve()
      ])
    );
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
