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
  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

  if (!vapidPublicKey || !vapidPrivateKey) {
    throw new Error('VAPID keys not configured in environment variables');
  }

  // 1. Generate VAPID Header
  const vapidHeader = generateVapidHeader(subscription.endpoint, vapidPrivateKey, vapidPublicKey);

  // 2. Encrypt Payload (AES-128-GCM)
  const encryptionResult = encryptPayload(payload, subscription.keys.p256dh, subscription.keys.auth);

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
function generateVapidHeader(endpoint: string, privateKey: string, publicKey: string): string {
  const url = new URL(endpoint);
  const origin = `${url.protocol}//${url.host}`;
  
  const header = { alg: 'ES256', typ: 'JWT' };
  const payload = {
    aud: origin,
    exp: Math.floor(Date.now() / 1000) + 12 * 60 * 60, // 12 hours
    sub: 'mailto:info@fmsc-koenigshoven.de'
  };

  const token = createVapidToken(header, payload, privateKey, publicKey);
  // VAPID header must NOT have a space after the comma and MUST NOT have padding in the 'k' parameter
  const cleanPublicKey = publicKey.replace(/=/g, '');
  return `vapid t=${token},k=${cleanPublicKey}`;
}

/**
 * Creates a signed JWT for VAPID
 */
function createVapidToken(header: Record<string, string>, payload: Record<string, unknown>, privateKeyBase64: string, publicKeyBase64: string): string {
  const headerEncoded = base64UrlEncode(Buffer.from(JSON.stringify(header)));
  const payloadEncoded = base64UrlEncode(Buffer.from(JSON.stringify(payload)));
  const unsignedToken = `${headerEncoded}.${payloadEncoded}`;

  // Extract X and Y coordinates from the uncompressed public key (65 bytes)
  // VAPID public key starts with 0x04 (uncompressed point indicator)
  const pubBuffer = base64UrlDecode(publicKeyBase64);
  // Support both 65-byte (with 0x04) and 64-byte raw keys
  const xBuffer = pubBuffer.length === 65 ? pubBuffer.subarray(1, 33) : pubBuffer.subarray(0, 32);
  const yBuffer = pubBuffer.length === 65 ? pubBuffer.subarray(33, 65) : pubBuffer.subarray(32, 64);

  // Use JWK (JSON Web Key) import
  // Node.js requires x and y even for private key import in JWK format
  const privateKeyObject = crypto.createPrivateKey({
    key: {
      kty: 'EC',
      crv: 'P-256',
      x: base64UrlEncode(xBuffer),
      y: base64UrlEncode(yBuffer),
      d: base64UrlEncode(base64UrlDecode(privateKeyBase64))
    },
    format: 'jwk'
  });

  const signer = crypto.createSign('SHA256');
  signer.update(unsignedToken);
  // ASN.1 DER signature from crypto.sign must be converted to raw (r, s) for JWT
  const derSignature = signer.sign(privateKeyObject);
  const rawSignature = derToRaw(derSignature);

  return `${unsignedToken}.${base64UrlEncode(rawSignature)}`;
}

function derToRaw(der: Buffer): Buffer {
  // DER: 0x30 L 0x02 Lr r 0x02 Ls s
  let offset = 2;
  const rLen = der[offset + 1];
  let r = der.subarray(offset + 2, offset + 2 + rLen);
  if (rLen === 33 && r[0] === 0x00) r = r.subarray(1);
  offset += 2 + rLen;
  const sLen = der[offset + 1];
  let s = der.subarray(offset + 2, offset + 2 + sLen);
  if (sLen === 33 && s[0] === 0x00) s = s.subarray(1);
  
  // Pad r and s to 32 bytes
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
