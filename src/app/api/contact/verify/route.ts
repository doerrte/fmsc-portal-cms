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
      if (dbData.push_subscriptions && dbData.push_subscriptions.length > 0) {
        const unreadCount = dbData.messages.filter((m: ContactMessage) => m.status === 'new').length;
        
        const notificationPayload = JSON.stringify({
          title: `Neue Nachricht: ${newMessage.subject}`,
          body: `${newMessage.name}: ${newMessage.message.substring(0, 50)}${newMessage.message.length > 50 ? '...' : ''}`,
          url: '/dashboard?tab=nachrichten',
          badgeCount: unreadCount
        });

        // Filter valid subscriptions (users who are admin or board)
        const authorizedUserIds = new Set(
          dbData.members
            .filter((m: MemberItem) => m.role === 'admin' || m.role === 'board')
            .map((m: MemberItem) => m.id)
        );

        const targetSubscriptions = dbData.push_subscriptions.filter(
          (sub: PushSubscriptionItem) => authorizedUserIds.has(sub.userId)
        );

        // Send notifications in parallel (ignoring failures for individual devices)
        Promise.all(
          targetSubscriptions.map(s => 
            sendNotification(s.subscription, notificationPayload).catch((err: unknown) => 
              console.error(`Push failed for subscription ${s.id}:`, err)
            )
          )
        );
      }

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: 'Captcha verification failed' }, { status: 400 });
    }
  } catch (error) {
    console.error('reCAPTCHA Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
