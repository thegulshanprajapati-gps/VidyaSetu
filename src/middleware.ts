import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';

  // Detect admin subdomain (e.g., admin.biharcollegeportal.in or admin.localhost:3000 or admin.lvh.me:3000)
  const isAdminSubdomain = hostname.startsWith('admin.');

  if (isAdminSubdomain) {
    console.log(`\x1b[35m🌐 [SUBDOMAIN ROUTING]\x1b[0m Admin subdomain detected: \x1b[1m${hostname}${url.pathname}\x1b[0m`);

    // Route "/" on admin subdomain directly to the Platform Super Admin dashboard
    if (url.pathname === '/') {
      return NextResponse.rewrite(new URL('/platform-admin', req.url));
    }

    // Route other paths: if they don't already have /platform-admin, rewrite internally
    if (
      !url.pathname.startsWith('/platform-admin') &&
      !url.pathname.startsWith('/api') &&
      !url.pathname.startsWith('/_next') &&
      !url.pathname.startsWith('/login')
    ) {
      return NextResponse.rewrite(new URL(`/platform-admin${url.pathname}`, req.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
