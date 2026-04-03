'use client';

import { useState, useEffect } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { savePushSubscriptionAction, testPushAction, testSinglePushAction, testContactPushAction, verifySubscriptionAction, clearMyPushSubscriptionsAction } from '@/app/dashboard/actions';

export default function PushNotificationManager() {
  const [hasMounted, setHasMounted] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    setHasMounted(true);
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      checkSubscription();
    }
    
    if ('BroadcastChannel' in window) {
      const channel = new BroadcastChannel('push-channel');
      channel.onmessage = (event) => {
        alert(`PUSH EMPFANGEN: ${event.data.title}\n\n${event.data.body}`);
      };
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
    if (base64String.startsWith('{')) {
      try {
        const jwk = JSON.parse(base64String);
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
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray.length === 91 ? outputArray.subarray(26) : outputArray;
  }

  async function subscribeToPush() {
    setLoading(true);
    setMessage(null);
    try {
      const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      let registration = await navigator.serviceWorker.ready;
      
      if (!registration.active) {
        await new Promise<void>((resolve) => {
          const checkReady = () => {
            if (reg.active) {
              registration = reg;
              resolve();
            } else {
              setTimeout(checkReady, 100);
            }
          };
          checkReady();
        });
      }

      if (Notification.permission !== 'granted') {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') throw new Error('Berechtigung verweigert.');
      }

      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidKey) throw new Error('VAPID Key fehlt.');

      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey)
      });

      const res = await savePushSubscriptionAction(JSON.stringify(sub.toJSON()));
      if (res.success) {
        setSubscription(sub);
        setMessage({ text: 'Erfolgreich abonniert!', type: 'success' });
      } else {
        throw new Error(res.error || 'Speicherfehler');
      }
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
      alert(`Fehler: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function unsubscribeFromPush() {
    setLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();
      if (sub) {
        await sub.unsubscribe();
        setSubscription(null);
        setMessage({ text: 'Deaktiviert.', type: 'success' });
      }
    } catch (err: any) {
      alert('Fehler: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function simulateContactPush() {
    setLoading(true);
    try {
      const res = await testContactPushAction();
      if (res.success) {
        alert(`Erfolg! ${res.count} Gerät(e) kontaktiert.`);
      } else {
        alert('Simulation fehlgeschlagen: ' + (res.error || 'Kein Abo gefunden.'));
      }
    } catch (e: any) {
      alert('Simulations-Fehler: ' + e.message);
    } finally {
      setLoading(false);
    }
  }

  async function testPushBroadCast() {
    setLoading(true);
    try {
      const res = await testPushAction();
      if (res.success) {
        alert(`Zustellung erfolgreich! ${res.count} Geräte erreicht.`);
      } else {
        alert('Test fehlgeschlagen.');
      }
    } catch (err: any) {
      alert('Fehler: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function testThisDeviceOnly() {
    if (!subscription) return alert('Bitte erst aktivieren.');
    setLoading(true);
    try {
      const res = await testSinglePushAction(JSON.stringify(subscription.toJSON()));
      if (res.success) {
        alert('Einzel-Push erfolgreich gesendet!');
      } else {
        alert('Fehler: ' + res.error);
      }
    } catch (err: any) {
      alert('Fehler: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function forceUpdateWorker() {
    setLoading(true);
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const reg of registrations) await reg.update();
      await navigator.serviceWorker.register('/sw.js?v=' + Date.now(), { scope: '/' });
      alert('Update erfolgreich. Bitte Seite neu laden.');
    } catch (err) {
      alert('Update fehlgeschlagen.');
    } finally {
      setLoading(false);
    }
  }

  async function showDebugInfo() {
    if (!subscription) return alert('Kein Abo gefunden.');
    const endpoint = subscription.endpoint;
    try {
      await navigator.clipboard.writeText(endpoint);
      const res = await verifySubscriptionAction(endpoint);
      alert(`✅ ID KOPIERT!\n\nStatus: ${res.exists ? 'In DB' : 'Nicht in DB'}`);
    } catch (e: any) {
      alert('Fehler: ' + e.message);
    }
  }

  async function copyIdToClipboard() {
    if (!subscription) return alert('Bitte erst aktivieren.');
    try {
      await navigator.clipboard.writeText(subscription.endpoint);
      alert('ID kopiert!');
    } catch (e) {
      alert('Fehler.');
    }
  }

  if (!hasMounted) return null;
  if (!isSupported) {
    return (
      <div className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
        <BellOff className="w-8 h-8 text-white/30 mb-2" />
        <span className="text-xs text-white/40 text-center">Nicht unterstützt.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-2 h-2 rounded-full ${subscription ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
        <span className="text-sm font-medium text-white/90">
          Push: {subscription ? 'Abonniert ✅' : 'Inaktiv ❌'}
        </span>
      </div>

      {!subscription ? (
        <button onClick={subscribeToPush} disabled={loading} className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white rounded-lg font-semibold transition-all active:scale-95">
          {loading ? 'Aktivierung...' : 'Jetzt Aktivieren'}
        </button>
      ) : (
        <button onClick={unsubscribeFromPush} disabled={loading} className="w-full py-2 px-4 bg-white/10 hover:bg-white/20 text-white/70 rounded-lg font-medium transition-all active:scale-95 text-xs">
          Deaktivieren
        </button>
      )}

      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
        <button onClick={showDebugInfo} className="text-[10px] text-white/40 underline py-1">Diagnose</button>
        <button onClick={testPushBroadCast} className="text-[10px] text-green-500/50 underline py-1">Alle Admins testen</button>
        <button onClick={testThisDeviceOnly} className="text-[10px] text-blue-500/50 underline py-1">Nur mein Handy</button>
        <button onClick={simulateContactPush} className="text-[10px] text-orange-500/50 underline py-1">Kontakt-Alarm Sim</button>
        <button onClick={forceUpdateWorker} className="text-[10px] text-orange-500/50 underline py-1">Update</button>
        <button onClick={copyIdToClipboard} className="text-[10px] text-orange-500/50 underline font-bold py-1">ID Kopieren</button>
      </div>

      {message && (
        <div className={`mt-2 text-[10px] text-center ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
          {message.text}
        </div>
      )}
    </div>
  );
}
