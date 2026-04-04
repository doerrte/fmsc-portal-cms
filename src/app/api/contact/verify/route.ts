import { NextResponse } from 'next/server';
import { getDbData, saveDbData, ContactMessage } from '@/lib/db';
import { sendNotification } from '@/lib/webpush';

export async function POST(request: Request) {
  try {
    const { token, ...formData } = await request.json();

    // DIAGNOSTIC BYPASS: We assume success even without token to test PUSH delivery
    const bypassRecapture = true; 

    if (bypassRecapture || token) {
      const dbData = await getDbData();
      
      const newMessage: ContactMessage = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        date: new Date().toLocaleString('de-DE'),
        status: 'new'
      };

      if (!dbData.messages) dbData.messages = [];
      dbData.messages.push(newMessage);
      await saveDbData(dbData);

      // TRIGGER PUSH
      try {
        if (dbData.push_subscriptions && dbData.push_subscriptions.length > 0) {
          const unreadCount = dbData.messages.filter((m: any) => m.status === 'new').length || 1;
          
          const notificationPayload = JSON.stringify({
            title: 'Max Mustermann (VOM ECHTEN FORMULAR)',
            body: `DIAGNOSE: reCAPTCHA wurde umgangen.\nBetreff: ${newMessage.subject}\n\n${(newMessage.message || '').substring(0, 80)}...`,
            url: '/dashboard?tab=nachrichten',
            badgeCount: unreadCount,
            tag: 'contact-form-message',
            vibrate: [200, 100, 200],
            icon: '/icon.png'
          });

          // UNIQUE ENDPOINTS ONLY
          const uniqueEndpoints = new Map();
          dbData.push_subscriptions.forEach((s: any) => {
            if (s.subscription && s.subscription.endpoint) {
              uniqueEndpoints.set(s.subscription.endpoint, s);
            }
          });
          const deliveryPool = Array.from(uniqueEndpoints.values());
          
          const cleanP = (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '').trim().replace(/^['"]|['"]$/g, '');
          const cleanPr = (process.env.VAPID_PRIVATE_KEY || '').trim().replace(/^['"]|['"]$/g, '').replace(/\\n/g, '\n');
          
          let successCount = 0;
          let targetsInfo: string[] = [];

          if (!cleanP || !cleanPr) {
            console.error('[PUSH] VAPID Keys Missing');
          } else {
            for (const s of deliveryPool) {
              try {
                await sendNotification(s.subscription, notificationPayload, cleanPr, cleanP);
                successCount++;
                const ep = String(s.subscription?.endpoint || 'unknown');
                targetsInfo.push(ep.substring(Math.max(0, ep.length - 15)));
              } catch (e) {
                console.error('[PUSH] Loop error:', e);
              }
            }
          }
          
          return NextResponse.json({ 
            success: true, 
            pushAttempted: true, 
            bypassActive: true,
            results: { 
              successCount, 
              targets: targetsInfo,
              totalPool: dbData.push_subscriptions.length 
            } 
          });
        }
      } catch (pushErr: any) {
        console.error('[PUSH] Fatal error:', pushErr);
        return NextResponse.json({ success: true, pushAttempted: true, pushError: pushErr.message });
      }

      return NextResponse.json({ success: true, pushAttempted: false });
    } else {
      return NextResponse.json({ success: false, error: 'Captcha verification failed (Bypass inactive)' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal Error' }, { status: 500 });
  }
}
