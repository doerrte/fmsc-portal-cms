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
  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
  const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY!;

  if (!vapidPublicKey || !vapidPrivateKey) {
    throw new Error('VAPID keys not configured');
  }

  // 1. Generate VAPID JWT
  const endpoint = new URL(subscription.endpoint);
  const origin = endpoint.origin;
  
  const jwtHeader = { typ: 'JWT', alg: 'ES256' };
  const jwtPayload = {
    aud: origin,
    exp: Math.floor(Date.now() / 1000) + 12 * 3600, // 12 hours
    sub: 'mailto:info@fmsc-koenigshoven.de'
  };

  const token = createVapidToken(jwtHeader, jwtPayload, vapidPrivateKey);

  // 2. Encrypt Payload (AES-128-GCM)
  const encryptionResult = encryptPayload(payload, subscription.keys.p256dh, subscription.keys.auth);

  // 3. Send HTTP POST to Push Service
  const response = await fetch(subscription.endpoint, {
    method: 'POST',
    headers: {
      'TTL': '86400',
      'Content-Encoding': 'aes128gcm',
      'Authorization': `vapid t=${token}, k=${vapidPublicKey}`,
      'Content-Type': 'application/octet-stream'
    },
    body: encryptionResult as any
  });

  if (!response.ok) {
    const errorText = await response.text();
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
 * Creates a signed JWT for VAPID
 */
function createVapidToken(header: object, payload: object, privateKeyBase64: string): string {
  const headerEncoded = base64UrlEncode(Buffer.from(JSON.stringify(header)));
  const payloadEncoded = base64UrlEncode(Buffer.from(JSON.stringify(payload)));
  const unsignedToken = `${headerEncoded}.${payloadEncoded}`;

  // EC Private Key should be raw 32 bytes for the prime256v1 curve
  const privateKey = crypto.createPrivateKey({
    key: Buffer.concat([
      Buffer.from([0x30, 0x31, 0x02, 0x01, 0x01, 0x04, 0x20]),
      base64UrlDecode(privateKeyBase64),
      Buffer.from([0xa0, 0x0a, 0x06, 0x08, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x03, 0x01, 0x07])
    ]),
    format: 'der',
    type: 'pkcs8'
  });

  const signer = crypto.createSign('SHA256');
  signer.update(unsignedToken);
  // ASN.1 DER signature from crypto.sign must be converted to raw (r, s) for JWT
  const derSignature = signer.sign(privateKey);
  const rawSignature = derToRaw(derSignature);

  return `${unsignedToken}.${base64UrlEncode(rawSignature)}`;
}

function derToRaw(der: Buffer): Buffer {
  // Very basic DER parser for EC signatures (r, s)
  // DER: 0x30 L 0x02 Lr r 0x02 Ls s
  let offset = 2;
  const rLen = der[offset + 1];
  let r = der.slice(offset + 2, offset + 2 + rLen);
  if (rLen === 33 && r[0] === 0x00) r = r.slice(1);
  offset += 2 + rLen;
  const sLen = der[offset + 1];
  let s = der.slice(offset + 2, offset + 2 + sLen);
  if (sLen === 33 && s[0] === 0x00) s = s.slice(1);
  
  // Pad r and s to 32 bytes if necessary
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
  
  // Add padding: RFC 8188 requires a single 0x02 byte for "aes128gcm" at the end of the data,
  // before any actual padding.
  const recordBuf = Buffer.concat([payloadBuf, Buffer.from([0x02])]);

  // Use a random salt (16 bytes)
  const salt = crypto.randomBytes(16);

  // Generate ephemeral server keys
  const serverEcdh = crypto.createECDH('prime256v1');
  const serverPublicKey = serverEcdh.generateKeys();
  
  // Derive shared secret
  const clientPublicKey = base64UrlDecode(p256dhBase64);
  const sharedSecret = serverEcdh.computeSecret(clientPublicKey);
  
  const authSecret = base64UrlDecode(authBase64);

  // Derive PRK and then content encryption key (CEK) and nonce
  // HKDF keys as per RFC 8291
  const infoInner = Buffer.concat([
    Buffer.from('WebPush: info\0', 'utf8'),
    clientPublicKey,
    serverPublicKey
  ]);

  const prk = Buffer.from(crypto.hkdfSync('sha256', sharedSecret, authSecret, Buffer.from('Content-Encoding: auth\0', 'utf8'), 32));
  const cek = Buffer.from(crypto.hkdfSync('sha256', prk, salt, Buffer.concat([Buffer.from('Content-Encoding: aes128gcm\0', 'utf8'), infoInner]), 16));
  const nonce = Buffer.from(crypto.hkdfSync('sha256', prk, salt, Buffer.concat([Buffer.from('Content-Encoding: nonce\0', 'utf8'), infoInner]), 12));

  // AES-128-GCM encryption
  const cipher = crypto.createCipheriv('aes-128-gcm', cek, nonce);
  const ciphertext = Buffer.concat([cipher.update(recordBuf), cipher.final()]);
  const tag = cipher.getAuthTag();

  // Construct the "aes128gcm" binary record
  // Salt (16) + record size (4, usually 4096) + pubkey size (1) + pubkey (65) + ciphertext + tag
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
