'use client';

import { useState, useEffect } from 'react';
import { Bell, BellOff, ShieldAlert, Loader2, Zap, Trash2, Settings2 } from 'lucide-react';
import { savePushSubscriptionAction, testPushAction, testContactPushAction, verifySubscriptionAction, clearMyPushSubscriptionsAction, getMyUserIdAction } from '@/app/dashboard/actions';

export default function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMsg = `[${timestamp}] ${msg}`;
    console.log(logMsg);
    setLogs(prev => [logMsg, ...prev].slice(0, 50));
  };

  useEffect(() => {
    setHasMounted(true);
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      checkSubscription();
      fetchIdentity();
      
      // Proactively update Service Worker to clear caches
      navigator.serviceWorker.ready.then(reg => {
        reg.update().then(() => addLog('SW Update Check completed'));
      });

      if (typeof navigator !== 'undefined' && 'clearAppBadge' in navigator) {
        (navigator as any).clearAppBadge().catch((err: any) => console.log('Clear badge error:', err));
      }
    }
    
    if ('BroadcastChannel' in window) {
      const channel = new BroadcastChannel('push-notifications');
      channel.onmessage = (event) => {
        console.log('[PUSH] Received in-app message:', event.data);
      };
      return () => channel.close();
    }
  }, []);

  async function fetchIdentity() {
    try {
      const res = await getMyUserIdAction();
      if (res.success) {
        setUserId(res.userId || null);
        setUserRole(res.role || null);
      }
    } catch (e) { console.error('Identity fetch failed', e); }
  }

  async function checkSubscription() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();
      if (sub) {
        const verifyRes = await verifySubscriptionAction(sub.endpoint);
        if (verifyRes.success && verifyRes.exists) {
          addLog('Status: Aktiviert (Server bestätigt)');
          setSubscription(sub);
        } else {
          addLog('Status: Inaktiv (Server verweigert)');
          setSubscription(null);
        }
      } else {
        setSubscription(null);
      }
    } catch (error) {
      console.error('Subscription check failed:', error);
      setSubscription(null);
    }
  }

  async function handleClearAll() {
    if (!confirm('Wirklich ALLE Push-Registrierungen für diesen Account löschen?')) return;
    setIsLoading(true);
    try {
      const res = await clearMyPushSubscriptionsAction();
      if (res.success) {
        alert(`${res.count} Registrierungen gelöscht.`);
        setSubscription(null);
        const registration = await navigator.serviceWorker.ready;
        const sub = await registration.pushManager.getSubscription();
        if (sub) await sub.unsubscribe();
      }
    } catch (e) { alert('Fehler beim Löschen.'); }
    setIsLoading(false);
  }

  async function subscribeToPush() {
    console.log('[PUSH] Starting activation sequence...');
    setIsLoading(true);
    try {
      // 1. Check permissions first
      if (typeof Notification !== 'undefined') {
        const currentPermission = Notification.permission;
        addLog(`Permission State: ${currentPermission}`);
        if (currentPermission === 'denied') {
          addLog('FEHLER: Berechtigung verweigert.');
          alert('Benachrichtigungen sind im Browser gesperrt. Bitte in den Standort-Einstellungen/Berechtigungen freigeben!');
          setIsLoading(false);
          return;
        }
      }

      // 2. Check Service Worker
      addLog('Warte auf Service Worker...');
      const registration = await navigator.serviceWorker.ready;
      addLog('Service Worker bereit.');

      // 3. Prepare VAPID key
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidKey) {
        addLog('FEHLER: VAPID Key fehlt!');
        alert('Technischer Fehler: VAPID-Key fehlt.');
        setIsLoading(false);
        return;
      }
      addLog('VAPID gefunden. Registriere...');
      const convertedKey = urlBase64ToUint8Array(vapidKey);

      // 4. Request Push Subscription
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedKey
      });
      addLog('Browser-Abo erhalten.');

      // 5. Save to database
      addLog('Synchronisiere mit Datenbank...');
      const res = await savePushSubscriptionAction(JSON.stringify(sub.toJSON()));
      
      if (res.success) {
        addLog('ERFOLG: Aktiviert! ✅');
        setSubscription(sub);
        alert('Aktiviert! ✅');
      } else {
        addLog(`FEHLER: DB Save failed: ${res.error}`);
        await sub.unsubscribe();
        alert('Server-Fehler: ' + res.error);
      }
    } catch (error: any) {
      addLog(`FATALER FEHLER: ${error.message || 'Unbekannt'}`);
      alert('Aktivierung fehlgeschlagen: ' + (error.message || 'Unbekannter Fehler'));
    }
    setIsLoading(false);
  }

  async function unsubscribeFromPush() {
    setIsLoading(true);
    try {
      if (subscription) {
        await subscription.unsubscribe();
        setSubscription(null);
        alert('Deaktiviert.');
      }
    } catch (error) { console.error(error); }
    setIsLoading(false);
  }

  async function testPush() {
    setIsLoading(true);
    try {
      const res = await testPushAction();
      console.log('[PUSH AUDIT RESULT]', res);
      if (res.success) {
        const count = (res as any).count || 0;
        if (res.pushAttempted && count > 0) {
          alert(`Test-Push an ${count} Geräte gesendet.`);
        } else {
          alert('Keine Geräte für diesen Benutzer gefunden oder Versand fehlgeschlagen. (Details in Console)');
        }
      } else {
        alert('Serverfehler: ' + (res.error || 'Unbekannter Fehler'));
      }
    } catch (e) {
      alert('Verbindung fehlgeschlagen.');
    }
    setIsLoading(false);
  }

  async function sendSimulationNotification() {
    setIsLoading(true);
    try {
      const res = await testContactPushAction();
      if (res.success) {
        const count = (res as any).count || 0;
        alert(`Simulation an ${count} Geräte gesendet.`);
      } else {
        alert('Fehler: ' + (res.error || 'Unbekannter Fehler'));
      }
    } catch (error) { alert('Fehler bei Simulation.'); }
    setIsLoading(false);
  }

  if (!hasMounted) return null;

  return (
    <div className="card glass p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-secondary/20 rounded-lg text-secondary">
          <Bell size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold title-gradient">Benachrichtigungen <span className="text-[10px] opacity-40 font-mono">v2.2</span></h2>
          <p className="text-sm text-gray-400">PWA Push Center & Diagnose</p>
        </div>
      </div>

      {!isSupported ? (
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg flex items-start gap-3">
          <ShieldAlert className="text-red-500 shrink-0" size={20} />
          <p className="text-sm text-red-200">Browser unterstützt kein Push-Manager.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col gap-4">
            <div className={`p-4 rounded-xl border ${subscription ? 'bg-green-500/10 border-green-500/30' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Status</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${subscription ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'}`}>
                  {subscription ? 'AKTIV' : 'INAKTIV'}
                </span>
              </div>
              {subscription && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono text-slate-400 truncate">
                    ...{subscription?.endpoint?.substring(Math.max(0, (subscription?.endpoint?.length || 20) - 20)) || 'Unbekannt'}
                  </p>
                </div>
              )}
              <p className="text-xs text-gray-400 mt-2">{subscription ? 'Empfängt administrative Alarme.' : 'Push aktivieren für neue Anfragen.'}</p>
            </div>
            <div className="bg-blue-500/5 border border-blue-500/20 p-3 rounded-lg flex justify-between items-center">
              <span className="text-[10px] text-gray-500 font-mono">ID: {userId || '...'}</span>
              <span className="text-[10px] text-blue-400 uppercase font-bold">{userRole}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {!subscription ? (
                <button onClick={subscribeToPush} disabled={isLoading} className="btn-primary flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold disabled:opacity-50">
                  {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} />} Jetzt aktivieren
                </button>
              ) : (
                <button onClick={unsubscribeFromPush} disabled={isLoading} className="bg-gray-800 hover:bg-gray-700 text-white flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold disabled:opacity-50">
                  <BellOff size={18} /> Deaktivieren
                </button>
              )}
              <button onClick={handleClearAll} disabled={isLoading} className="bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/30 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold">
                <Trash2 size={18} /> Altlasten löschen
              </button>
            </div>
          </div>
          {subscription && (
            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest"><Settings2 size={14} /> Diagnose</div>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={testPush} disabled={isLoading} className="bg-secondary/10 hover:bg-secondary/20 text-secondary text-xs font-bold py-2 px-3 rounded-lg border border-secondary/20 transition-all">Test-Alarm</button>
                <button onClick={sendSimulationNotification} disabled={isLoading} className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-bold py-2 px-3 rounded-lg border border-blue-500/20 transition-all underline decoration-dotted">Kontakt-Alarm</button>
              </div>
            </div>
          )}

          {/* Debug Console UI */}
          <div className="mt-8 border-t border-white/5 pt-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">System-Protokoll</span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(logs.join('\n'));
                  alert('Logs kopiert! ✅');
                }}
                className="text-[10px] bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-slate-400"
              >
                Logs kopieren
              </button>
            </div>
            <div className="max-h-[200px] overflow-y-auto bg-black/40 rounded-lg p-3 font-mono text-[10px] space-y-1">
              {logs.length === 0 ? (
                <p className="text-gray-600">Noch keine Ereignisse protokolliert.</p>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className={log.includes('ERFOLG') ? 'text-green-500' : log.includes('FEHLER') ? 'text-red-500' : 'text-gray-400'}>
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function urlBase64ToUint8Array(publicKeyInput: string) {
  if (!publicKeyInput) {
    console.error('VAPID Public Key is missing!');
    return new Uint8Array();
  }

  let base64String = publicKeyInput.trim();
  
  // Robust check for JWK (JSON Web Key) format which we used for Safari
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
    } catch (err) {
      console.error('JWK parsing failed, falling back to base64', err);
    }
  }

  // Standard Base64 handling
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
