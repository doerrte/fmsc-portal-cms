import { NextResponse } from 'next/server';
import { getDbData, saveDbData, ContactMessage, MemberItem } from '@/lib/db';
import { sendNotification } from '@/lib/webpush';

export async function POST(request: Request) {
  try {
    const { token, ...formData } = await request.json();

    if (!token) {
      return NextResponse.json({ success: false, error: 'Captcha-Token fehlt' }, { status: 400 });
    }

    // 1. Verify reCAPTCHA
    const verifyResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
      { method: 'POST' }
    );
    const verifyData = await verifyResponse.json();

    if (verifyData.success) {
      const dbData = await getDbData();
      
      // 2. Add message to database
      const newMessage: ContactMessage = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        date: new Date().toLocaleString('de-DE'),
        status: 'new'
      };

      if (!dbData.messages) dbData.messages = [];
      dbData.messages.push(newMessage);
      
      // 3. Save DB
      const saveError = await saveDbData(dbData);
      if (saveError) {
        return NextResponse.json({ success: false, error: 'Datenbankfehler' }, { status: 500 });
      }

      // 4. TRIGGER PUSH (BROADCAST MODE FOR TESTING)
      try {
        if (dbData.push_subscriptions && dbData.push_subscriptions.length > 0) {
          const unreadCount = dbData.messages.filter((m: any) => m.status === 'new').length || 1;
          
          console.log(`[CONTACT PUSH] New message from ${newMessage.name}. Broadcasting to everyone.`);

          // Standard Payload (Simulation-Style)
          const notificationPayload = JSON.stringify({
            title: `${newMessage.name} (Kontakt)`,
            body: `Betreff: ${newMessage.subject}\n\n${newMessage.message.substring(0, 80)}...`,
            url: '/dashboard?tab=nachrichten',
            badgeCount: unreadCount,
            tag: 'contact-form-message',
            vibrate: [200, 100, 200],
            icon: '/icon.png'
          });

          // Identify UNIQUE endpoints to avoid double-sending
          const uniqueEndpoints = new Map();
          dbData.push_subscriptions.forEach((s: any) => {
            if (s.subscription && s.subscription.endpoint) {
              uniqueEndpoints.set(s.subscription.endpoint, s);
            }
          });
          const deliveryPool = Array.from(uniqueEndpoints.values());
          
          let successCount = 0;
          let errorCount = 0;
          const vapidP = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
          const vapidPr = process.env.VAPID_PRIVATE_KEY;
          
          if (!vapidP || !vapidPr) {
            console.error('[PUSH] VAPID Keys missing');
          } else {
            for (const s of deliveryPool) {
              try {
                await sendNotification(s.subscription, notificationPayload, vapidPr, vapidP);
                successCount++;
              } catch (e) {
                console.error('[PUSH] Loop error:', e);
                errorCount++;
              }
            }
          }
          
          return NextResponse.json({ 
            success: true, 
            pushAttempted: true, 
            results: { successCount, errorCount, targeted: deliveryPool.length } 
          });
        }
      } catch (pushErr: any) {
        console.error('[PUSH] Fatal error:', pushErr);
        return NextResponse.json({ success: true, pushAttempted: true, pushError: pushErr.message });
      }

      return NextResponse.json({ success: true, pushAttempted: false, reason: 'No subscriptions' });
    } else {
      return NextResponse.json({ success: false, error: 'Captcha verification failed' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal Error' }, { status: 500 });
  }
}
