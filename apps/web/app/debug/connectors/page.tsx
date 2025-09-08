import Link from 'next/link'
import { discoverConnectors } from '@/lib/discoverConnectors'
import { connectorStatus } from '@/lib/connectorStatus'

// Server component that lists connectors and whether they are using live or
// bundled sample data. Helps verify environment config in deployments.
export const metadata = { title: 'Debug: Connectors' }

export default async function DebugConnectorsPage() {
  const connectors = await discoverConnectors()

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-semibold mb-6">Debug: Connectors</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-2">Connector</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Path</th>
            </tr>
          </thead>
          <tbody>
            {connectors.map((c) => (
              <tr key={c.slug} className="border-t">
                <td className="p-2 font-medium">{c.title}</td>
                <td className="p-2">{connectorStatus(c.slug)}</td>
                <td className="p-2 text-gray-500">
                  <Link href={`/connectors/${c.slug}`} className="underline">
                    /connectors/{c.slug}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}

