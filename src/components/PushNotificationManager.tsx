'use client';

import { useState, useEffect } from 'react';
import { Bell, BellOff, Send, Smartphone } from 'lucide-react';
import { savePushSubscriptionAction, testPushAction } from '@/app/dashboard/actions';

export default function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    console.log('PushNotificationManager mounted');
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      checkSubscription();
      
      // Diagnostic check for the Public Key
      if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
        console.warn('VAPID public key is missing! Check Vercel Environment Variables.');
      } else {
        console.log('VAPID public key found in browser.');
      }
    } else {
      console.log('Push notifications not supported or serviceWorker missing in navigator');
    }
  }, []);

  async function checkSubscription() {
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.getSubscription();
    setSubscription(sub);
  }

  function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  async function subscribe() {
    setLoading(true);
    setMessage(null);
    try {
      // 1. Register Service Worker (if not already)
      await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      
      const registration = await navigator.serviceWorker.ready;

      // 2. Request permission (though subscribe handles it)
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Berechtigung für Benachrichtigungen wurde verweigert.');
      }

      // 3. Subscribe
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidKey) {
        throw new Error('VAPID Public Key ist im Browser nicht konfiguriert (NEXT_PUBLIC_VAPID_PUBLIC_KEY fehlt).');
      }

      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey)
      });

      // 4. Send to server
      const res = await savePushSubscriptionAction(sub.toJSON());
      if (res.success) {
        setSubscription(sub);
        setMessage({ text: 'Erfolgreich abonniert!', type: 'success' });
      } else {
        throw new Error(res.error || 'Fehler beim Speichern des Abonnements.');
      }
    } catch (err: any) {
      console.error('Push subscription error:', err);
      setMessage({ text: err.message || 'Fehler beim Aktivieren der Benachrichtigungen.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  async function unsubscribe() {
    setLoading(true);
    try {
      if (subscription) {
        await subscription.unsubscribe();
        setSubscription(null);
        setMessage({ text: 'Benachrichtigungen deaktiviert.', type: 'success' });
      }
    } catch (err) {
      console.error('Unsubscribe error:', err);
      setMessage({ text: 'Fehler beim Deaktivieren.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  async function handleTestPush() {
    setLoading(true);
    try {
      const res = await testPushAction();
      if (res.success) {
        setMessage({ text: `Test-Push gesendet (an ${res.count} Geräte)!`, type: 'success' });
      } else {
        setMessage({ text: res.error || 'Fehler beim Test-Push.', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Ein Fehler ist aufgetreten.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  if (!isSupported) {
    return (
      <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-500 text-sm">
        <Smartphone className="w-5 h-5 mb-2" />
        Push-Benachrichtigungen werden von diesem Browser nicht unterstützt. 
        Hinweis für iOS: Bitte fügen Sie die App zuerst zum Home-Bildschirm hinzu.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${subscription ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
            {subscription ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
          </div>
          <div>
            <h4 className="font-medium text-white">Push-Benachrichtigungen</h4>
            <p className="text-sm text-gray-400">
              {subscription ? 'Aktiviert auf diesem Gerät' : 'Aktuell deaktiviert'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {subscription ? (
            <>
              <button
                onClick={handleTestPush}
                disabled={loading}
                className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" /> Test-Push
              </button>
              <button
                onClick={unsubscribe}
                disabled={loading}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm transition-colors"
              >
                Deaktivieren
              </button>
            </>
          ) : (
            <button
              onClick={subscribe}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors shadow-lg shadow-blue-600/20"
            >
              Aktivieren
            </button>
          )}
        </div>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
          {message.text}
        </div>
      )}
    </div>
  );
}
