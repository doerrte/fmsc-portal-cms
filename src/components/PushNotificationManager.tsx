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

  useEffect(() => {
    setHasMounted(true);
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      checkSubscription();
      fetchIdentity();
      
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
          setSubscription(sub);
        } else {
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
    setIsLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!)
      });
      const res = await savePushSubscriptionAction(JSON.stringify(sub));
      if (res.success) {
        setSubscription(sub);
        alert('Aktiviert! ✅');
      } else {
        await sub.unsubscribe();
        alert('Fehler: ' + res.error);
      }
    } catch (error) {
      alert('Aktivierung fehlgeschlagen. Berechtigungen prüfen.');
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

  async function sendTestNotification() {
    setIsLoading(true);
    try {
      const res = await testPushAction();
      if (res.success) alert(`Test-Push an ${res.count} Geräte gesendet.`);
      else alert('Fehler: ' + res.error);
    } catch (error) { alert('Fehler beim Senden.'); }
    setIsLoading(false);
  }

  async function sendSimulationNotification() {
    setIsLoading(true);
    try {
      const res = await testContactPushAction();
      if (res.success) alert(`Simulation an ${res.count} Geräte gesendet.`);
      else alert('Fehler: ' + res.error);
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
          <h2 className="text-xl font-bold title-gradient">Benachrichtigungen</h2>
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
              <p className="text-xs text-gray-400">{subscription ? 'Empfängt administrative Alarme.' : 'Push aktivieren für neue Anfragen.'}</p>
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
                <button onClick={sendTestNotification} disabled={isLoading} className="bg-secondary/10 hover:bg-secondary/20 text-secondary text-xs font-bold py-2 px-3 rounded-lg border border-secondary/20 transition-all">Test-Alarm</button>
                <button onClick={sendSimulationNotification} disabled={isLoading} className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-bold py-2 px-3 rounded-lg border border-blue-500/20 transition-all underline decoration-dotted">Kontakt-Alarm</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
