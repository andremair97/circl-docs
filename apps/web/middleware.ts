import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Optional Basic Auth middleware
// Why: gate preview deployments and Cloudflare Pages when env flags are set
const isProd = process.env.VERCEL_ENV === 'production';
const usingAppAuth = process.env.APP_BASIC_AUTH === '1';

export function middleware(req: NextRequest) {
  const enablePreviewAuth = !isProd && !usingAppAuth;

  const user = usingAppAuth
    ? process.env.APP_BASIC_USER || ''
    : process.env.PREVIEW_AUTH_USER || '';
  const pass = usingAppAuth
    ? process.env.APP_BASIC_PASS || ''
    : process.env.PREVIEW_AUTH_PASS || '';

  // Skip when auth isn't enabled or credentials missing
  if (!(usingAppAuth || enablePreviewAuth) || !user || !pass) {
    return NextResponse.next();
  }

  const header = req.headers.get('authorization') || '';
  const [scheme, encoded] = header.split(' ');
  if (scheme !== 'Basic' || !encoded) {
    // Trigger browser auth prompt when header absent or malformed
    return new NextResponse('Authentication required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Protected"' },
    });
  }

  const [u, p] = Buffer.from(encoded, 'base64').toString().split(':');
  if (u === user && p === pass) return NextResponse.next();

  return new NextResponse('Forbidden', { status: 403 });
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)$).*)',
  ],
};
