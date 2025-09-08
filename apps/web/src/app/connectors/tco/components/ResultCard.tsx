import { TcoProduct } from '@/src/lib/connectors/tco/types';

// Card view for an individual TCO Certified product.
export default function ResultCard({ item }: { item: TcoProduct }) {
  const name = [item.brand, item.model].filter(Boolean).join(' ') || item.id;
  const gtinOnly = !item.brand && !item.model && !!item.gtin;

  return (
    <div className="rounded-md border p-4 text-sm">
      <h3 className="mb-1 text-base font-semibold">{name}</h3>
      {item.productType && <p className="mb-2 text-gray-600">{item.productType}</p>}
      <div className="mb-2 flex flex-wrap gap-1">
        {item.generation && (
          <span className="rounded bg-gray-100 px-1 text-xs">{item.generation}</span>
        )}
        {item.certificateNumber && (
          <span className="rounded bg-gray-100 px-1 text-xs">#{item.certificateNumber}</span>
        )}
        {item.certifiedSince && item.validUntil && (
          <span className="rounded bg-gray-100 px-1 text-xs">
            {item.certifiedSince} → {item.validUntil}
          </span>
        )}
        {gtinOnly && <span className="rounded bg-gray-100 px-1 text-xs">GTIN only</span>}
      </div>
      <div className="flex flex-wrap gap-2 text-sm">
        {item.detailUrl && (
          <a
            href={item.detailUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Open in Product Finder
          </a>
        )}
        {item.certificateUrl && (
          <a
            href={item.certificateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Certificate PDF
          </a>
        )}
      </div>
    </div>
  );
}
