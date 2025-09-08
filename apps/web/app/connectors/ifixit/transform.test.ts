import { describe, expect, it } from 'vitest';
import { transformSuggest, transformGuideDetail } from '../../../src/lib/connectors/ifixit/transform';
import sampleSuggest from '../../../public/connectors/ifixit/sample_suggest.json';
import sampleGuide from '../../../public/connectors/ifixit/sample_guide.json';

describe('iFixit transformers', () => {
  it('splits guides and wikis from suggest', () => {
    const res = transformSuggest(sampleSuggest);
    expect(res.guides).toHaveLength(1);
    expect(res.wikis).toHaveLength(1);
  });

  it('counts arrays in guide detail', () => {
    const detail = transformGuideDetail(sampleGuide);
    expect(detail.stepsCount).toBe(2);
    expect(detail.partsCount).toBe(1);
    expect(detail.toolsCount).toBe(1);
    const minimal = transformGuideDetail({ guideid: 1, title: 't', url: 'u' });
    expect(minimal.stepsCount).toBe(0);
  });
});
