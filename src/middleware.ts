import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Die Middleware wird auf jedem Seitenaufruf aufgerufen
export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  
  // Schütze alles unterhalb von /admin
  if (url.pathname.startsWith('/admin')) {
    // Überprüfe, ob der "Opa-Keks" existiert
    const authCookie = request.cookies.get('auth');
    if (!authCookie || authCookie.value !== 'admin') {
      // Wenn nicht eingeloggt, schicke ihn zum Login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// Definiere die Pfade, auf die die Middleware anspringen soll
export const config = {
  matcher: ['/admin/:path*'],
};
