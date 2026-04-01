import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import GlobalBackground from "@/components/GlobalBackground";
import AdminBar from "@/components/AdminBar";
import { AdminProvider } from "@/components/AdminContext";
import { cookies } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FMSC Königshoven 1975 e.V.",
  description: "Modellflugsport in Bedburg",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/logo.png' },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("auth")?.value;
  const isAdmin = authCookie ? authCookie.split('|')[1] === 'admin' : false;
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider>
          <AdminProvider isAdmin={isAdmin}>
            <GlobalBackground />
            <AdminBar />
            {children}
          </AdminProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
