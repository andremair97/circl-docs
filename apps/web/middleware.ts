import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

// Middleware to optionally gate the site behind a simple password.
// Why: early-stage deployments need lightweight access control without
// relying on Vercel's preview protection.
const PUBLIC_PATHS = new Set([
  '/login',
  '/api/auth/login',
  '/api/auth/logout',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
])

export const config = {
  // Protect everything except Next internals; we skip specific paths in code too.
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

async function isValidCookie(token: string | undefined): Promise<boolean> {
  // Validate JWT cookie when present; missing token or secret fails fast.
  if (!token) return false
  const secret = process.env.PROTECT_SECRET
  if (!secret) return false
  try {
    await jwtVerify(token, new TextEncoder().encode(secret))
    return true
  } catch {
    return false
  }
}

export default async function middleware(req: NextRequest) {
  // Fast exit if disabled via env flag.
  if (!(process.env.PROTECT_ENABLED === 'true')) return NextResponse.next()

  const { pathname } = req.nextUrl
  if (pathname.startsWith('/_next')) return NextResponse.next()
  for (const p of PUBLIC_PATHS) if (pathname.startsWith(p)) return NextResponse.next()

  const cookieName = process.env.PROTECT_COOKIE_NAME || 'circl_protect'
  const token = req.cookies.get(cookieName)?.value
  if (await isValidCookie(token)) return NextResponse.next()

  const url = req.nextUrl.clone()
  url.pathname = '/login'
  url.searchParams.set('returnTo', req.nextUrl.pathname + req.nextUrl.search)
  return NextResponse.redirect(url)
}
