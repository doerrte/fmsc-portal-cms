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

    // Diagnostic Foreground Listener
    if ('BroadcastChannel' in window) {
      const channel = new BroadcastChannel('push-channel');
      channel.onmessage = (event) => {
        console.log('[DIAG] Received foreground push message:', event.data);
        alert(`Beweis: Push-Nachricht "${event.data.title}" am Handy empfangen! Wenn Sie kein Banner sehen, blockiert Ihr Gerät die Anzeige.`);
      };
    }
  }, []);

  async function showDebugInfo() {
    if (!subscription) {
      alert('Kein aktives Abonnement auf diesem Gerät gefunden. (Technisch: Subscription-Objekt im Browser-State ist null)');
      return;
    }
    const info = JSON.stringify(subscription.toJSON(), null, 2);
    const endpoint = subscription.endpoint;
    
    // Auto-verify with server
    try {
      const actions = await import('@/app/dashboard/actions');
      const res = await actions.verifySubscriptionAction(endpoint);
      alert(`TECHNISCHE DATEN:\n\nServer-Check: ${res.exists ? '✅ In Datenbank gefunden' : '❌ FEHLT IN DATENBANK'}\n\nEndpoint: ${endpoint.substring(0, 50)}...\n\nFull JSON: ${info}`);
    } catch (e: any) {
      alert(`Fehler beim System-Check: ${e.message}`);
    }
  }

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
      // 1. Ensure sw is registered and ACTIVE
      const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      let registration = await navigator.serviceWorker.ready;

      // Force wait for the 'active' state if it's still installing/waiting
      if (!registration.active) {
        console.log('SW not active yet, waiting for activation...');
        await new Promise<void>((resolve) => {
          const checkActive = () => {
            if (reg.active) {
              registration = reg;
              resolve();
            } else {
              setTimeout(checkActive, 100);
            }
          };
          checkActive();
        });
      }

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
      console.log('Sending subscription to server...');
      const res = await savePushSubscriptionAction(JSON.stringify(sub.toJSON()));
      if (res.success) {
        setSubscription(sub);
        const msg = res.isUpdate ? 'Abonnement aktualisiert!' : 'Erfolgreich neu abonniert!';
        setMessage({ text: msg, type: 'success' });
        alert(`ERFOLG: ${msg}`);
      } else {
        throw new Error(res.error || 'Serverfehler beim Speichern.');
      }
    } catch (err: any) {
      console.error('Subscription error:', err);
      const errorMsg = err.message || 'Fehler beim Aktivieren.';
      setMessage({ text: errorMsg, type: 'error' });
      alert(`DIAGNOSE FEHLER: ${errorMsg}`);
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
      
      // Also try to unregister the worker for a clean state
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const reg of registrations) {
        await reg.unregister();
      }
      
      setSubscription(null);
      setMessage({ text: 'Push-Benachrichtigungen deaktiviert und zurückgesetzt.', type: 'success' });
    } catch (err) {
      console.error('Unsubscribe error:', err);
      setMessage({ text: 'Deaktivierung fehlgeschlagen.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  async function hardReset() {
    if (!confirm('Dies löscht alle Browser-Registrierungen für Push auf diesem Gerät. Fortfahren?')) return;
    setLoading(true);
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const reg of registrations) {
        await reg.unregister();
      }
      localStorage.removeItem('fmsc_push_last_sub'); // Optional cleanup
      window.location.reload();
    } catch (err) {
      console.error('Reset error:', err);
      alert('Reset fehlgeschlagen.');
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
            text: `Test-Push: ${response.count} erfolgreich, ${response.failed || 0} fehlgeschlagen. ${response.cleaned ? `(${response.cleaned} ungültige Geräte bereinigt)` : ''}`, 
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
          <button 
            onClick={showDebugInfo}
            className="text-[10px] text-gray-500 underline hover:text-gray-300 block mx-auto py-2"
          >
            System-Check (Diagnose)
          </button>
          <div className="pt-2">
            <p className="text-[10px] text-gray-500 font-mono break-all opacity-50">
              ID: {subscription.endpoint.split('/').pop()?.substring(0, 20)}...
            </p>
            <button 
              onClick={hardReset}
              className="text-[10px] text-gray-600 underline hover:text-gray-400 mt-1"
            >
              Probleme? Service-Worker Reset
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
          <button 
            onClick={showDebugInfo}
            className="text-[10px] text-gray-600 underline hover:text-gray-400 block mx-auto py-2"
          >
            System-Check (Diagnose)
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
