import { TcoProduct, TcoGtinRecord } from './types';

export function transformTcoRecord(r: TcoGtinRecord): TcoProduct | null {
  if (!r) return null;

  // Try common shapes; tolerate JSON-LD and flat JSON.
  const gtin = String(
    r.gtin || r.GTIN || r.id || r['@id']?.toString().split('/').pop() || ''
  ).trim();

  const productType =
    r.product_type || r.productType || r.category || r['@type'] || undefined;

  const brand =
    r.brand?.name || r.brand || r.manufacturer || undefined;

  const model =
    r.model || r.modelName || r.name || undefined;

  const certificateNumber =
    r.certificateNumber || r.certificate_number || undefined;

  const generation =
    r.generation || r.tcoGeneration || undefined;

  const certifiedSince =
    r.certifiedSince || r.certification_date || r.validFrom || undefined;

  const validUntil =
    r.validUntil || r.valid_to || r.expires || undefined;

  const detailUrl =
    r.detailUrl || r.detail_url || r.productFinderUrl || undefined;

  const certificateUrl =
    r.certificateUrl || r.certificate_url || undefined;

  const id =
    gtin ||
    certificateNumber ||
    [brand, model].filter(Boolean).join(' ') ||
    (typeof productType === 'string' ? productType : '') ||
    '';

  if (!id) return null;

  return {
    id,
    productType: typeof productType === 'string' ? productType : undefined,
    brand: typeof brand === 'string' ? brand : undefined,
    model: typeof model === 'string' ? model : undefined,
    generation: typeof generation === 'string' ? generation : undefined,
    certificateNumber: typeof certificateNumber === 'string' ? certificateNumber : undefined,
    certifiedSince: typeof certifiedSince === 'string' ? certifiedSince : undefined,
    validUntil: typeof validUntil === 'string' ? validUntil : undefined,
    gtin: gtin || undefined,
    detailUrl: typeof detailUrl === 'string' ? detailUrl : undefined,
    certificateUrl: typeof certificateUrl === 'string' ? certificateUrl : undefined,
  };
}
