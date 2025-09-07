import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Preview-only Basic Auth middleware
// Why: guard non-production deployments when preview credentials are set
const isProd = process.env.VERCEL_ENV === 'production';

export function middleware(req: NextRequest) {
  // Skip in production to avoid affecting live traffic
  if (isProd) return NextResponse.next();

  const user = process.env.PREVIEW_AUTH_USER || '';
  const pass = process.env.PREVIEW_AUTH_PASS || '';
  // If credentials are missing, bypass auth to avoid accidental lockouts
  if (!user || !pass) return NextResponse.next();

  const header = req.headers.get('authorization') || '';
  const [scheme, encoded] = header.split(' ');
  if (scheme !== 'Basic' || !encoded) {
    // Prompt for credentials when auth header absent or malformed
    return new NextResponse('Authentication required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Preview"' },
    });
  }

  const [u, p] = Buffer.from(encoded, 'base64').toString().split(':');
  // Allow only when provided credentials match preview env values
  if (u === user && p === pass) return NextResponse.next();

  return new NextResponse('Forbidden', { status: 403 });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
