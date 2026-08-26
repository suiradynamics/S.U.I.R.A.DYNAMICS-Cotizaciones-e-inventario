import { type NextRequest, NextResponse } from 'next/server';

// Simple tenant resolution middleware. It infers the tenant subdomain from the Host header
// Example: myshop.example.com -> tenant slug 'myshop'
// Sets header 'x-tenant' with the inferred tenant id/slug for downstream handlers to use.

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  let tenant = null;

  // naive subdomain extraction: if host is like tenant.example.com
  if (host) {
    const parts = host.split('.');
    if (parts.length > 2) {
      tenant = parts[0];
    }
  }

  const res = NextResponse.next({
    request: {
      // add custom header for downstream use
      headers: new Headers({
        ...Object.fromEntries(request.headers),
        'x-tenant': tenant || ''
      })
    }
  });

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
