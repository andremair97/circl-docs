import { transformGuideDetail, transformSuggest } from './transform';
import type { IfixitGuideDetail, IfixitSearch } from './types';

const BASE = process.env.IFIXIT_API_BASE ?? 'https://www.ifixit.com/api/2.0';
const headers = {
  'User-Agent': 'circl-docs-ui',
  Accept: 'application/json',
};

// Queries iFixit for guides and devices. Falls back to bundled samples on error.
export async function searchIfixit(q: string): Promise<IfixitSearch> {
  const url = `${BASE}/suggest/${encodeURIComponent(q)}?doctypes=guide,device`;
  try {
    const res = await fetch(url, { headers, next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`status ${res.status}`);
    const json = await res.json();
    return transformSuggest(json);
  } catch {
    // Network errors or non-OK responses use sample data for graceful degradation.
    const sample = (await import('../../../../public/connectors/ifixit/sample_suggest.json')).default;
    return transformSuggest(sample);
  }
}

// Retrieves detailed information for a specific guide.
export async function getGuideDetail(id: number): Promise<IfixitGuideDetail | null> {
  const url = `${BASE}/guides/${id}`;
  try {
    const res = await fetch(url, { headers, next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`status ${res.status}`);
    const json = await res.json();
    return transformGuideDetail(json);
  } catch {
    // Fallback sample ensures UI still renders basic guide info.
    try {
      const sample = (await import('../../../../public/connectors/ifixit/sample_guide.json')).default;
      return transformGuideDetail(sample);
    } catch {
      return null;
    }
  }
}
