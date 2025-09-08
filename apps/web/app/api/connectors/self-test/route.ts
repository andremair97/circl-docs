import { NextRequest, NextResponse } from 'next/server';
import { CONNECTORS } from '@/src/connectors/registry';
import { runSelfTest } from '@/src/connectors/self-test';
import type { ConnectorId } from '@/src/connectors/types';

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id') as ConnectorId | null;
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const def = CONNECTORS.find((c) => c.id === id);
  if (!def) return NextResponse.json({ error: 'unknown connector' }, { status: 404 });
  const result = await runSelfTest(def);
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const ids: ConnectorId[] = Array.isArray(body?.ids) ? body.ids : [];
  const defs = ids.length ? CONNECTORS.filter((c) => ids.includes(c.id)) : CONNECTORS;
  const settled = await Promise.allSettled(defs.map((d) => runSelfTest(d)));
  const results = settled.map((r, i) =>
    r.status === 'fulfilled' ? r.value : { id: defs[i].id, label: defs[i].label, status: 'fail', elapsedMs: 0, checks: [{ name: 'self-test', ok: false, details: String(r.reason) }], envFindings: [], fixPrompt: String(r.reason) },
  );
  return NextResponse.json(results);
}
