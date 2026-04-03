import webpush from 'web-push';

/**
 * Interface matches the structure stored in our database
 */
export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

/**
 * Sends a push notification using the standard web-push library.
 * This handles all RFC 8188 (encryption) and RFC 8292 (VAPID) details.
 */
export async function sendNotification(
  subscription: PushSubscription,
  payload: string,
  vapidPrivateKey: string,
  vapidPublicKey: string
): Promise<Response> {
  
  // 1. Prepare VAPID Details
  let finalPublicKey = vapidPublicKey;
  let finalPrivateKey = vapidPrivateKey;

  // Handle JWK format if necessary
  if (vapidPublicKey.startsWith('{')) {
    const jwk = JSON.parse(vapidPublicKey);
    const x = Buffer.from(jwk.x.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
    const y = Buffer.from(jwk.y.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
    finalPublicKey = Buffer.concat([Buffer.from([0x04]), x, y]).toString('base64')
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  // Handle Private Key JWK
  if (vapidPrivateKey.startsWith('{')) {
    const jwk = JSON.parse(vapidPrivateKey);
    finalPrivateKey = jwk.d; // web-push expects the 'd' parameter for EC private keys
  }

  webpush.setVapidDetails(
    'mailto:info@fmsc-koenigshoven.de',
    finalPublicKey,
    finalPrivateKey
  );

  try {
    const pushSubscription = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth
      }
    };

    const response = await webpush.sendNotification(
      pushSubscription,
      payload,
      {
        TTL: 86400,
        urgency: 'high'
      }
    );

    // Return a mock Fetch Response object for compatibility with existing actions
    return {
      ok: response.statusCode >= 200 && response.statusCode < 300,
      status: response.statusCode,
      json: async () => ({}),
      text: async () => response.body || ''
    } as any;
  } catch (error: any) {
    console.error('[WEBPUSH] Detailed error:', error);
    
    // web-push throws on error status codes (410, 401, etc.)
    return {
      ok: false,
      status: error.statusCode || 500,
      json: async () => ({ error: error.message }),
      text: async () => error.body || error.message
    } as any;
  }
}
