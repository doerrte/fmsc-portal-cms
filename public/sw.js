self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('push', function(event) {
  if (event.data) {
    let data;
    try {
      data = event.data.json();
    } catch (e) {
      console.warn('Push data is not JSON, treating as text');
      data = { title: 'FMSC Nachricht', body: event.data.text() };
    }

    const title = data.title || 'FMSC Portal ✈️';
    const body = data.body || 'Neue Nachricht empfangen.';
    const iconUrl = new URL('/icon.png', self.location.origin).href;
    
    // Notify the UI if it's open (Foreground Alert)
    const channel = new BroadcastChannel('push-channel');
    channel.postMessage({ title, body, icon: iconUrl });

    // Fallback options for high compatibility (iOS/Mobile)
    const options = {
      body: body,
      icon: iconUrl,
      badge: iconUrl,
      tag: 'fmsc-push-notification',
      renotify: true,
      vibrate: [200, 100, 200],
      data: {
        url: data.url || '/dashboard?tab=nachrichten'
      }
    };

    // Attempt to show the complex notification
    event.waitUntil(
      self.registration.showNotification(title, options).catch(err => {
        console.error('Complex notification failed, showing simple fallback:', err);
        return self.registration.showNotification(title, { body: body });
      })
    );

    // Update App Badge if supported
    if ('setAppBadge' in navigator) {
      navigator.setAppBadge(data.badgeCount || 1).catch(err => {});
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
