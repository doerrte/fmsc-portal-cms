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
    
    // Notify the UI if it's open
    const channel = new BroadcastChannel('push-channel');
    channel.postMessage({ title, body, data });

    // Set App Badge (Icon Counter)
    if (self.navigator.setAppBadge && data.badgeCount !== undefined) {
      self.navigator.setAppBadge(data.badgeCount);
    }

    const options = {
      body: body,
      icon: data.icon || '/icon.png',
      badge: '/badge-icon.png', // Small monochrome icon for Android status bar
      image: data.image || null, // Large image support for Chrome/Android
      vibrate: data.vibrate || [200, 100, 200], // Vibration pattern
      tag: data.tag || 'fmsc-contact-inquiry',
      renotify: true,
      data: { url: data.url || '/dashboard?tab=nachrichten' },
      actions: data.actions || [
        { action: 'view', title: 'Ansehen' },
        { action: 'close', title: 'Schließen' }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  }
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
