import crypto from 'crypto';

/**
 * Web Push Protocol implementation (Zero-dependency)
 * Supporting RFC 8291 (Encryption) and RFC 8292 (VAPID)
 */

interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export async function sendNotification(subscription: PushSubscription, payload: string) {
  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim().replace(/\s/g, '');
  const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY?.trim().replace(/\s/g, '');

  if (!vapidPublicKey || !vapidPrivateKey) {
    throw new Error('VAPID keys not configured in environment variables');
  }

  // 1. Generate VAPID Header
  const vapidHeader = generateVapidHeader(subscription.endpoint, vapidPrivateKey, vapidPublicKey);

  // 2. Encrypt Payload (AES-128-GCM)
  const encryptionResult = encryptPayload(payload, subscription.keys.p256dh, subscription.keys.auth);

  // 3. Send HTTP POST to Push Service
  console.log(`[WEBPUSH] Fetching endpoint: ${subscription.endpoint}`);
  const response = await fetch(subscription.endpoint, {
    method: 'POST',
    headers: {
      'TTL': '86400',
      'Content-Encoding': 'aes128gcm',
      'Authorization': vapidHeader,
      'Content-Type': 'application/octet-stream'
    },
    body: encryptionResult as any
  });

  console.log(`[WEBPUSH] Response status: ${response.status}`);
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[WEBPUSH] Error response: ${errorText}`);
    throw new Error(`Push service error (${response.status}): ${errorText}`);
  }

  return response;
}

function base64UrlEncode(buf: Buffer): string {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(str: string): Buffer {
  return Buffer.from(str.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
}

/**
 * Generates the VAPID Authorization header
 */
function generateVapidHeader(endpoint: string, privateKeyInput: string, publicKeyInput: string): string {
  const url = new URL(endpoint);
  const origin = `${url.protocol}//${url.host}`;
  
  const header = { alg: 'ES256', typ: 'JWT' };
  const payload = {
    aud: origin,
    exp: Math.floor(Date.now() / 1000) + 12 * 60 * 60, // 12 hours
    sub: 'mailto:info@fmsc-koenigshoven.de'
  };

  const token = createVapidToken(header, payload, privateKeyInput);
  
  // Extract raw uncompressed public key point
  let cleanPublicKey: string;
  if (publicKeyInput.startsWith('{')) {
    // It's a JWK
    const jwk = JSON.parse(publicKeyInput);
    const x = base64UrlDecode(jwk.x);
    const y = base64UrlDecode(jwk.y);
    cleanPublicKey = base64UrlEncode(Buffer.concat([Buffer.from([0x04]), x, y]));
  } else {
    // Legacy/DER fallback
    const publicKeyObject = crypto.createPublicKey({
      key: base64UrlDecode(publicKeyInput),
      format: 'der',
      type: 'spki'
    });
    const rawPubKey = (publicKeyObject.export({ type: 'x9.62', format: 'der' } as any)) as Buffer;
    cleanPublicKey = base64UrlEncode(rawPubKey);
  }

  return `vapid t=${token},k=${cleanPublicKey}`;
}

/**
 * Creates a signed JWT for VAPID
 */
function createVapidToken(header: Record<string, string>, payload: Record<string, unknown>, privateKeyInput: string): string {
  const headerEncoded = base64UrlEncode(Buffer.from(JSON.stringify(header)));
  const payloadEncoded = base64UrlEncode(Buffer.from(JSON.stringify(payload)));
  const unsignedToken = `${headerEncoded}.${payloadEncoded}`;

  let privateKeyObject: crypto.KeyObject;
  if (privateKeyInput.startsWith('{')) {
    // It's a JWK
    privateKeyObject = crypto.createPrivateKey({
      key: JSON.parse(privateKeyInput),
      format: 'jwk'
    });
  } else {
    // Legacy/DER fallback
    privateKeyObject = crypto.createPrivateKey({
      key: base64UrlDecode(privateKeyInput),
      format: 'der',
      type: 'pkcs8'
    });
  }

  const signer = crypto.createSign('SHA256');
  signer.update(unsignedToken);
  const derSignature = signer.sign(privateKeyObject);
  const rawSignature = derToRaw(derSignature);

  return `${unsignedToken}.${base64UrlEncode(rawSignature)}`;
}

function derToRaw(der: Buffer): Buffer {
  let offset = 2;
  const rLen = der[offset + 1];
  let r = der.subarray(offset + 2, offset + 2 + rLen);
  if (rLen === 33 && r[0] === 0x00) r = r.subarray(1);
  offset += 2 + rLen;
  const sLen = der[offset + 1];
  let s = der.subarray(offset + 2, offset + 2 + sLen);
  if (sLen === 33 && s[0] === 0x00) s = s.subarray(1);
  
  const rPadded = Buffer.alloc(32);
  r.copy(rPadded, 32 - r.length);
  const sPadded = Buffer.alloc(32);
  s.copy(sPadded, 32 - s.length);
  
  return Buffer.concat([rPadded, sPadded]);
}

/**
 * Encrypts payload according to RFC 8188 (aes128gcm)
 */
function encryptPayload(payload: string, p256dhBase64: string, authBase64: string): Buffer {
  const payloadBuf = Buffer.from(payload, 'utf8');
  const recordBuf = Buffer.concat([payloadBuf, Buffer.from([0x02])]);
  const salt = crypto.randomBytes(16);

  const serverEcdh = crypto.createECDH('prime256v1');
  const serverPublicKey = serverEcdh.generateKeys();
  const clientPublicKey = base64UrlDecode(p256dhBase64);
  const sharedSecret = serverEcdh.computeSecret(clientPublicKey);
  const authSecret = base64UrlDecode(authBase64);

  const prk = Buffer.from(crypto.hkdfSync('sha256', sharedSecret, authSecret, Buffer.from('Content-Encoding: auth\0', 'utf8'), 32));
  const cek = Buffer.from(crypto.hkdfSync('sha256', prk, salt, Buffer.concat([Buffer.from('Content-Encoding: aes128gcm\0', 'utf8'), Buffer.from('WebPush: info\0', 'utf8'), clientPublicKey, serverPublicKey]), 16));
  const nonce = Buffer.from(crypto.hkdfSync('sha256', prk, salt, Buffer.concat([Buffer.from('Content-Encoding: nonce\0', 'utf8'), Buffer.from('WebPush: info\0', 'utf8'), clientPublicKey, serverPublicKey]), 12));

  const cipher = crypto.createCipheriv('aes-128-gcm', cek, nonce);
  const ciphertext = Buffer.concat([cipher.update(recordBuf), cipher.final()]);
  const tag = cipher.getAuthTag();

  const rs = 4096;
  const rsBuf = Buffer.alloc(4);
  rsBuf.writeUInt32BE(rs, 0);

  return Buffer.concat([
    salt,
    rsBuf,
    Buffer.from([serverPublicKey.length]),
    serverPublicKey,
    ciphertext,
    tag
  ]);
}
