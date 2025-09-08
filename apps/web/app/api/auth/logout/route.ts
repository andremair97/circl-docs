import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// API route to clear auth cookie.
// Why: allows users to explicitly sign out when protection is enabled.
export async function POST() {
  const name = process.env.PROTECT_COOKIE_NAME || 'circl_protect'
  cookies().set(name, '', { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 0 })
  return NextResponse.json({ ok: true })
}
