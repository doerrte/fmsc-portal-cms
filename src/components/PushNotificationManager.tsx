'use client';

import { useState, useEffect } from 'react';
import { Bell, BellOff, Send, Smartphone, CheckCircle } from 'lucide-react';
import { savePushSubscriptionAction, testPushAction } from '@/app/dashboard/actions';

export default function PushNotificationManager() {
  const [hasMounted, setHasMounted] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    console.log('PushNotificationManager mounted');
    setHasMounted(true);
    
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
      console.log('Push notifications ARE supported by this browser');
      setIsSupported(true);
      checkSubscription();
      
      // Diagnostic check for the Public Key
      if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
        console.warn('VAPID public key is missing! Check Vercel Environment Variables.');
      } else {
        console.log('VAPID public key found in browser:', process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY.substring(0, 10) + '...');
      }
    } else {
      console.log('Push notifications NOT supported or serviceWorker missing in navigator');
    }
  }, []);

  async function checkSubscription() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();
      setSubscription(sub);
    } catch (err) {
      console.error('Error checking subscription:', err);
    }
  }

  function urlBase64ToUint8Array(publicKeyInput: string) {
    let base64String = publicKeyInput.trim();
    
    // Check if it's a JWK
    if (base64String.startsWith('{')) {
      try {
        const jwk = JSON.parse(base64String);
        // Standard P-256 raw point is 0x04 + x + y
        const x = Uint8Array.from(window.atob(jwk.x.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
        const y = Uint8Array.from(window.atob(jwk.y.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
        const raw = new Uint8Array(1 + x.length + y.length);
        raw[0] = 0x04;
        raw.set(x, 1);
        raw.set(y, 1 + x.length);
        return raw;
      } catch (e) {
        console.error('Failed to parse JWK public key', e);
      }
    }

    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    // If the key is a full SPKI DER (91 bytes for P-256), extract the last 65 bytes (the raw point)
    if (outputArray.length === 91) {
      console.log('Detected SPKI DER public key, extracting raw point...');
      return outputArray.subarray(26);
    }

    return outputArray;
  }

  async function subscribeToPush() {
    setLoading(true);
    setMessage(null);
    console.log('Starting push subscription process...');
    try {
      // 1. Ensure sw is registered
      await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      const registration = await navigator.serviceWorker.ready;

      // 2. Request permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Berechtigung verweigert.');
      }

      // 3. Subscribe
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidKey) throw new Error('VAPID Key fehlt.');

      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey)
      });

      // 4. Save to DB
      const res = await savePushSubscriptionAction(JSON.stringify(sub.toJSON()));
      if (res.success) {
        setSubscription(sub);
        setMessage({ text: 'Abonniert!', type: 'success' });
      } else {
        throw new Error(res.error || 'Serverfehler beim Speichern.');
      }
    } catch (err: any) {
      console.error('Subscription error:', err);
      setMessage({ text: err.message || 'Fehler beim Aktivieren.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  async function unsubscribeFromPush() {
    console.log('Deaktivieren button clicked');
    setLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();
      if (sub) {
        await sub.unsubscribe();
      }
      setSubscription(null);
      setMessage({ text: 'Push-Benachrichtigungen deaktiviert.', type: 'success' });
    } catch (err) {
      console.error('Unsubscribe error:', err);
      setMessage({ text: 'Deaktivierung fehlgeschlagen.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  async function sendTestPush() {
    console.log('Test-Push button clicked');
    setLoading(true);
    try {
      const response = await testPushAction() as any;
      console.log('Server response:', response);
      if (response.success) {
        if (response.count === 0 && response.error) {
          setMessage({ 
            text: `Test-Push Fehler: ${response.error}`, 
            type: 'error' 
          });
        } else {
          setMessage({ 
            text: `Test-Push erfolgreich an ${response.count} Gerät(e) gesendet!`, 
            type: 'success' 
          });
        }
      } else {
        setMessage({ text: 'Test-Push Fehler: ' + response.error, type: 'error' });
      }
    } catch (err) {
      console.error('Test Push Error:', err);
      setMessage({ text: 'Test-Push fehlgeschlagen (Client-Fehler)', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  if (!hasMounted) {
    return <div className="p-4 bg-white/5 rounded-xl border border-white/10 animate-pulse text-gray-500 text-sm">Lade Push-Einstellungen...</div>;
  }

  if (!isSupported) {
    return (
      <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-center gap-3">
        <BellOff className="text-yellow-500 shrink-0" size={24} />
        <p className="text-sm text-yellow-200/80">Push-Benachrichtigungen werden von diesem Browser nicht unterstützt.</p>
      </div>
    );
  }

  return (
    <div className="p-5 bg-white/5 rounded-2xl border border-white/10 glass shadow-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-orange-500/20 rounded-lg">
          <Bell className="text-orange-500" size={20} />
        </div>
        <h3 className="font-bold text-lg">Push-Benachrichtigungen</h3>
      </div>
      
      {subscription ? (
        <div className="space-y-4">
          <p className="text-sm text-green-400 font-medium flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Aktiviert auf diesem Gerät
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <button 
              onClick={sendTestPush} 
              disabled={loading}
              className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-xl font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-orange-500/20"
            >
              {loading ? <span className="animate-spin text-lg">🌀</span> : <Send size={18} />}
              Test-Push
            </button>
            <button 
              onClick={unsubscribeFromPush} 
              disabled={loading}
              className="px-5 py-2.5 bg-white/5 hover:bg-white/10 disabled:opacity-50 text-white border border-white/10 rounded-xl font-bold flex items-center gap-2 transition-all"
            >
              <BellOff size={18} />
              Deaktivieren
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-400">Bleiben Sie über neue Kontaktanfragen informiert, auch wenn das Portal geschlossen ist.</p>
          <button 
            onClick={subscribeToPush} 
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 bg-white text-black hover:bg-gray-100 disabled:opacity-50 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-white/10"
          >
            {loading ? <span className="animate-spin text-lg">🌀</span> : <Bell size={20} />}
            Jetzt Aktivieren
          </button>
        </div>
      )}
      
      {message && (
        <p className={`mt-4 text-xs font-medium px-3 py-2 rounded-lg ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
          {message.text}
        </p>
      )}
    </div>
  );
}
