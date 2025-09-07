import { NextRequest, NextResponse } from 'next/server';
import { searchProducts } from '@/src/server/search';
import { Mode } from '@/src/components/PathwayTabs';

// Handles search requests backed by fixtures to keep the UI fast during early
// development. Swapping to live connectors later only requires adjusting the
// server search module.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  const mode = (searchParams.get('mode') as Mode) || 'borrow';

  try {
    const items = await searchProducts(q, mode);
    return NextResponse.json({ items });
  } catch (err) {
    return NextResponse.json({ error: 'search_failed' }, { status: 500 });
  }
}
