import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ultra-permissive config to unblock mobile devices
  allowedDevOrigins: [
    '192.168.178.123',
    '192.168.178.123:3000',
    'localhost:3000',
    '127.0.0.1:3000'
  ],
  // Erhöhtes Limit für Datei-Uploads
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb',
    },
  },
};

export default nextConfig;
