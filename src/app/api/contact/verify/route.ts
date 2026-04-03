import { NextResponse } from 'next/server';
import { getDbData, saveDbData, ContactMessage, MemberItem, PushSubscriptionItem } from '@/lib/db';
import { sendNotification } from '@/lib/webpush';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { token, formData } = await request.json();

    if (!token) {
      return NextResponse.json({ success: false, error: 'Token missing' }, { status: 400 });
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

    let isVerified = false;

    // Handle dev bypass tokens
    if (token === 'dev-token-localhost' || token === 'dev-token-bypass') {
      console.warn('reCAPTCHA bypass token used for testing.');
      isVerified = true;
    } else {
      const response = await fetch(verifyUrl, { method: 'POST' });
      const data = await response.json();
      isVerified = data.success;
    }

    if (isVerified) {
      // 1. Fetch current DB data
      const dbData = await getDbData();
      
      // 2. Prepare new message
      const newMessage: ContactMessage = {
        id: crypto.randomUUID(),
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        date: new Date().toISOString(),
        status: 'new'
      };

      // 3. Append and save
      dbData.messages = [newMessage, ...(dbData.messages || [])];
      await saveDbData(dbData);

      // 4. Trigger Push Notifications for Admin/Board members
      try {
        if (dbData.push_subscriptions && dbData.push_subscriptions.length > 0) {
          const unreadCount = dbData.messages.filter((m: ContactMessage) => m.status === 'new').length;
          
          console.log(`[CONTACT PUSH] New message from ${newMessage.name}. Total unread: ${unreadCount}`);

          const cleanTitle = `${newMessage.name} (Kontaktformular)`.replace(/[^\x20-\x7E\xC0-\xFF]/g, '');
          const cleanBody = `E-Mail: ${newMessage.email}\nBetreff: ${newMessage.subject}\n\n${newMessage.message.substring(0, 100)}...`.replace(/[^\x20-\x7E\n\xC0-\xFF]/g, '');

          const notificationPayload = JSON.stringify({
            title: cleanTitle,
            body: cleanBody,
            url: '/dashboard?tab=nachrichten',
            badgeCount: unreadCount,
            tag: 'contact-form-message',
            vibrate: [200, 100, 200, 100, 200],
            icon: '/icon.png'
          });

          // Identify valid admin/board IDs (Robust string matching)
          const admins = dbData.members.filter((m: any) => {
            const role = (m.role || '').toLowerCase();
            return role === 'admin' || role === 'board';
          });
          
          // Ensure all IDs are strings for reliable Set matching
          const authorizedUserIds = new Set(admins.map((m: any) => String(m.id)));
          
          // Always include 'admin_initial'
          authorizedUserIds.add('admin_initial');

          console.log(`[CONTACT PUSH] Authorized Admin IDs (as strings):`, Array.from(authorizedUserIds));

          const targetSubscriptions = dbData.push_subscriptions.filter(
            (sub: any) => {
              const subUserId = String(sub.userId || sub.user_id || '');
              const matches = authorizedUserIds.has(subUserId);
              if (!matches) {
                console.log(`[CONTACT PUSH] Skipping sub ${sub.id} (User ID "${subUserId}" not in authorized list)`);
              } else {
                console.log(`[CONTACT PUSH] MATCH FOUND for sub ${sub.id} (User ID "${subUserId}")`);
              }
              return matches;
            }
          );

          console.log(`[CONTACT PUSH] Found ${targetSubscriptions.length} subscriptions for authorized admins.`);

          // Use a map to avoid duplicate endpoints
          const uniqueEndpoints = new Map();
          targetSubscriptions.forEach(s => uniqueEndpoints.set(s.subscription.endpoint, s));
          const uniqueSubs = Array.from(uniqueEndpoints.values());

          console.log(`[CONTACT PUSH] Final unique delivery targets from ADMIN filter: ${uniqueSubs.length}`);

          // FALLBACK LOGIC: If no admins found via role-matching, notify EVERYONE who has subscribed 
          // (assuming only admins/board can reach the dashboard to subscribe anyway).
          const finalDeliveryPool = uniqueSubs.length > 0 ? uniqueSubs : dbData.push_subscriptions;
          
          if (uniqueSubs.length === 0) {
            console.warn(`[CONTACT PUSH] NO ADMINS FOUND via role-matching. Falling back to ALL ${dbData.push_subscriptions.length} registered subscriptions.`);
          }

          // Get VAPID keys
          const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
          const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
          
          if (!vapidPublicKey || !vapidPrivateKey) {
            console.error('[CONTACT PUSH] VAPID keys are missing from environment');
          } else {
            console.log(`[CONTACT PUSH] Starting sequential delivery to ${finalDeliveryPool.length} devices...`);
            
            let successCount = 0;
            let errorCount = 0;
            
            // CRITICAL: Using for...of with await instead of Promise.all to ensure 
            // the serverless function doesn't kill the process mid-broadcast.
            for (const s of finalDeliveryPool) {
              try {
                await sendNotification(s.subscription, notificationPayload, vapidPrivateKey, vapidPublicKey);
                console.log(`[CONTACT PUSH] ✅ Success for device ${s.id}`);
                successCount++;
              } catch (err: unknown) {
                console.error(`[CONTACT PUSH] ❌ Error for device ${s.id}:`, err);
                errorCount++;
              }
            }
            
            console.log(`[CONTACT PUSH] Dispatch finished. Success: ${successCount}, Errors: ${errorCount}`);
            
            return NextResponse.json({ 
              success: true, 
              pushAttempted: true, 
              successCount, 
              errorCount 
            });
          }
        }
      } catch (pushErr) {
        console.error('[CONTACT PUSH] Fatal error in push cycle:', pushErr);
      }

      return NextResponse.json({ success: true, pushAttempted: false });
    } else {
      return NextResponse.json({ success: false, error: 'Captcha verification failed' }, { status: 400 });
    }
  } catch (error) {
    console.error('reCAPTCHA Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
