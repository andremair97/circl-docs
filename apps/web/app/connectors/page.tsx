import Link from 'next/link'
import { discoverConnectors } from '@/lib/discoverConnectors'
import { CONNECTOR_CATALOG } from '@/lib/connectorCatalog'

// Server Component (default). Node runtime assumed (no 'use client').
export const metadata = { title: 'Connectors' }

export default async function ConnectorsPage() {
  const discovered = await discoverConnectors()

  const items = discovered.length
    ? discovered
    : // Fallback to catalog if discovery fails/returns empty
      Object.entries(CONNECTOR_CATALOG).map(([slug, meta]) => ({
        slug,
        title: meta.title,
        description: meta.description,
      }))

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-semibold mb-6">Connectors</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((c) => (
          <Link
            key={c.slug}
            href={`/connectors/${c.slug}`}
            className="rounded-xl border p-4 hover:shadow"
          >
            <div className="font-medium">{c.title}</div>
            {c.description && <p className="text-sm text-gray-600 mt-1">{c.description}</p>}
            <p className="text-xs text-gray-500 mt-2">/connectors/{c.slug}</p>
          </Link>
        ))}
      </div>
      {!discovered.length && (
        <p className="mt-6 text-xs text-gray-500">
          Showing catalog fallback (filesystem discovery unavailable).
        </p>
      )}
    </main>
  )
}
