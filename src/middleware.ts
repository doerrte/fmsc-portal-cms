import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const authCookie = request.cookies.get('auth')?.value;
  
  // Parse Cookie payload (e.g. "uuid|admin" or "uuid|member")
  const role = authCookie ? authCookie.split('|')[1] : null;

  if (url.pathname.startsWith('/admin')) {
    if (!role || (role !== 'admin' && role !== 'board')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (url.pathname.startsWith('/dashboard')) {
    if (!role || (role !== 'admin' && role !== 'member' && role !== 'board')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
};
