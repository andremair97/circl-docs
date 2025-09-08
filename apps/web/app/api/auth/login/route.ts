import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SignJWT } from 'jose'

// API route to set auth cookie after password verification.
// Why: keeps login logic server-side and issues short-lived JWT for middleware.
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const password = (body?.password ?? '').toString()
  const returnTo = (body?.returnTo ?? '/').toString()

  if (!process.env.PROTECT_PASSWORD || !process.env.PROTECT_SECRET) {
    return NextResponse.json({ ok: false, error: 'Server auth not configured' }, { status: 500 })
  }

  if (password !== process.env.PROTECT_PASSWORD) {
    return NextResponse.json({ ok: false, error: 'Invalid password' }, { status: 401 })
  }

  const token = await new SignJWT({ ok: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(new TextEncoder().encode(process.env.PROTECT_SECRET))

  const name = process.env.PROTECT_COOKIE_NAME || 'circl_protect'
  cookies().set(name, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  return NextResponse.json({ ok: true, redirect: returnTo })
}
