import type {
  IfixitImage,
  IfixitSuggestGuide,
  IfixitSuggestWiki,
  IfixitGuideDetail,
  IfixitSearch,
} from './types';

// Coerces an arbitrary object with iFixit image fields into a typed image map.
// Undefined is returned when no known sizes exist to keep consumers simple.
export function coerceImage(obj: unknown): IfixitImage | undefined {
  if (!obj || typeof obj !== 'object') return undefined;
  const source = obj as Record<string, unknown>;
  const image: IfixitImage = {};
  const keys = ['thumbnail', 'mini', 'medium', 'large', 'standard', 'huge', 'original'] as const;
  let found = false;
  for (const k of keys) {
    const v = source[k];
    if (typeof v === 'string') {
      (image as Record<string, string>)[k] = v;
      found = true;
    }
  }
  return found ? image : undefined;
}

// Splits raw suggest results into guides and wikis, discarding unknown shapes.
export function transformSuggest(json: unknown): IfixitSearch {
  const guides: IfixitSuggestGuide[] = [];
  const wikis: IfixitSuggestWiki[] = [];
  const data = (json as { results?: unknown[] }).results;
  if (Array.isArray(data)) {
    for (const r of data) {
      const item = r as Record<string, unknown>;
      const type = item['dataType'];
      if (
        type === 'guide' &&
        typeof item['guideid'] === 'number' &&
        typeof item['title'] === 'string' &&
        typeof item['url'] === 'string'
      ) {
        guides.push({
          dataType: 'guide',
          guideid: item['guideid'] as number,
          title: item['title'] as string,
          subject: item['subject'] as string | undefined,
          category: item['category'] as string | undefined,
          url: item['url'] as string,
          image: coerceImage(item['image']),
        });
      } else if (type === 'wiki' && typeof item['title'] === 'string' && typeof item['url'] === 'string') {
        wikis.push({
          dataType: 'wiki',
          title: item['title'] as string,
          display_title: item['display_title'] as string | undefined,
          url: item['url'] as string,
          namespace: item['namespace'] as string | undefined,
          wikiid: item['wikiid'] as number | undefined,
          image: coerceImage(item['image']),
          summary: item['summary'] as string | undefined,
        });
      }
    }
  }
  return { guides, wikis };
}

// Normalises detailed guide payload to a concise structure with counts.
export function transformGuideDetail(json: unknown): IfixitGuideDetail {
  const data = json as Record<string, unknown>;
  return {
    guideid: data['guideid'] as number,
    title: data['title'] as string,
    url: data['url'] as string,
    category: data['category'] as string | undefined,
    type: data['type'] as string | undefined,
    difficulty: (data['difficulty'] as string | undefined) ?? null,
    time_required: (data['time_required'] as string | undefined) ?? null,
    stepsCount: Array.isArray(data['steps']) ? (data['steps'] as unknown[]).length : 0,
    partsCount: Array.isArray(data['parts']) ? (data['parts'] as unknown[]).length : 0,
    toolsCount: Array.isArray(data['tools']) ? (data['tools'] as unknown[]).length : 0,
    image: coerceImage(data['image']),
  };
}
