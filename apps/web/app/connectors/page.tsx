import Link from 'next/link'
import { CONNECTORS } from '@/lib/connectorCatalog'

// Hub page listing available connectors.
// Why: gives users a single entry point to explore data sources.
export const metadata = { title: 'Connectors' }

export default function ConnectorsPage() {
  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-semibold mb-6">Connectors</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CONNECTORS.map(c => (
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
    </main>
  )
}
