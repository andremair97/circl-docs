'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'

// Simple password form that hits auth API to set JWT cookie.
// Why: enables non-technical previews without shipping user accounts.
export default function LoginPage() {
  const sp = useSearchParams()
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const returnTo = sp.get('returnTo') ?? '/'

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password, returnTo }),
    })
    const data = await res.json()
    if (res.ok && data?.redirect) {
      router.push(data.redirect)
    } else {
      setError(data?.error ?? 'Login failed')
    }
  }

  return (
    <main className="mx-auto max-w-sm p-6">
      <h1 className="text-2xl font-semibold mb-4">Enter access password</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2"
            autoFocus
            aria-label="Access password"
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="rounded-md border px-3 py-2">Unlock</button>
      </form>
      <p className="mt-4 text-xs text-gray-500">You’ll stay signed in for 7 days on this device.</p>
    </main>
  )
}
