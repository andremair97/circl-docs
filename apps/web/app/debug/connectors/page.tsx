import { CONNECTORS } from '@/src/connectors/registry';
import type { ConnectorId, SelfTestResult } from '@/src/connectors/types';
import { notFound } from 'next/navigation';
import { useState } from 'react';

// Server component gating by env variable.
export const metadata = { title: 'Debug: Connector Diagnostics' };

export default function DebugConnectorsPage() {
  if (process.env.NEXT_PUBLIC_SHOW_DEBUG !== '1') return notFound();
  const connectors = CONNECTORS.map((c) => ({ id: c.id, label: c.label, docsUrl: c.docsUrl }));
  return <DiagnosticsClient connectors={connectors} />;
}

// Client component handles running tests and displaying results.
function DiagnosticsClient({
  connectors,
}: {
  connectors: { id: ConnectorId; label: string; docsUrl?: string }[];
}) {
  'use client';
  const [results, setResults] = useState<Record<ConnectorId, SelfTestResult>>({});
  const [loading, setLoading] = useState(false);
  const [lastRun, setLastRun] = useState<string>('');

  async function runAll() {
    setLoading(true);
    const res = await fetch('/api/connectors/self-test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: connectors.map((c) => c.id) }),
    });
    const data: SelfTestResult[] = await res.json();
    const map: Record<ConnectorId, SelfTestResult> = {} as any;
    data.forEach((r) => (map[r.id] = r));
    setResults(map);
    setLastRun(new Date().toLocaleString());
    setLoading(false);
  }

  async function runOne(id: ConnectorId) {
    setLoading(true);
    const res = await fetch(`/api/connectors/self-test?id=${id}`);
    const data: SelfTestResult = await res.json();
    setResults((prev) => ({ ...prev, [id]: data }));
    setLastRun(new Date().toLocaleString());
    setLoading(false);
  }

  return (
    <main className="mx-auto max-w-4xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Connector Diagnostics</h1>
      <button
        className="px-3 py-1 rounded bg-blue-600 text-white disabled:opacity-50"
        onClick={runAll}
        disabled={loading}
      >
        {loading ? 'Running...' : 'Run all'}
      </button>
      {lastRun && <p className="text-sm text-gray-500">Last run: {lastRun}</p>}
      <div className="space-y-6">
        {connectors.map((c) => {
          const r = results[c.id];
          return (
            <div key={c.id} className="border p-4 rounded">
              <div className="flex items-center justify-between">
                <div className="font-medium">
                  {c.label}
                  {c.docsUrl && (
                    <a href={c.docsUrl} className="ml-2 text-sm underline" target="_blank" rel="noreferrer">
                      docs
                    </a>
                  )}
                </div>
                <button
                  className="px-2 py-1 text-sm rounded bg-gray-200 disabled:opacity-50"
                  onClick={() => runOne(c.id)}
                  disabled={loading}
                >
                  Run test
                </button>
              </div>
              {r && <ResultBlock result={r} />}
            </div>
          );
        })}
      </div>
    </main>
  );
}

function ResultBlock({ result }: { result: SelfTestResult }) {
  'use client';
  const [showTrace, setShowTrace] = useState(false);
  return (
    <div className="mt-4 space-y-2 text-sm">
      <div>Status: {result.status}</div>
      <div>
        Env:
        <ul className="ml-4 list-disc">
          {result.envFindings.map((e) => (
            <li key={e.key}>
              {e.key}: {e.present ? 'present' : 'missing'}
            </li>
          ))}
        </ul>
      </div>
      {result.checks.length > 0 && (
        <table className="mt-2 border min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-1 text-left">Check</th>
              <th className="p-1 text-left">OK</th>
              <th className="p-1 text-left">Details</th>
            </tr>
          </thead>
          <tbody>
            {result.checks.map((c) => (
              <tr key={c.name} className="border-t">
                <td className="p-1">{c.name}</td>
                <td className="p-1">{c.ok ? 'yes' : 'no'}</td>
                <td className="p-1">{c.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {result.httpTrace && (
        <div>
          <button className="underline" onClick={() => setShowTrace((v) => !v)}>
            {showTrace ? 'Hide' : 'Show'} HTTP trace
          </button>
          {showTrace && (
            <pre className="mt-2 bg-gray-100 p-2 overflow-x-auto">
{JSON.stringify(result.httpTrace, null, 2)}
            </pre>
          )}
        </div>
      )}
      <button
        className="px-2 py-1 text-xs rounded bg-gray-200"
        onClick={() => navigator.clipboard.writeText(result.fixPrompt)}
      >
        Copy fix prompt
      </button>
    </div>
  );
}
