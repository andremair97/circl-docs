import { TcoProduct } from '@/src/lib/connectors/tco/types';

// Compact table view of TCO Certified products.
export default function ResultTable({ items }: { items: TcoProduct[] }) {
  if (items.length === 0) return <p className="mt-4 text-sm">No results.</p>;
  return (
    <table className="mt-8 w-full text-sm">
      <thead>
        <tr className="border-b text-left">
          <th className="p-2">Product</th>
          <th className="p-2">Type</th>
          <th className="p-2">Gen</th>
          <th className="p-2">Cert #</th>
          <th className="p-2">Since</th>
          <th className="p-2">Until</th>
          <th className="p-2">GTIN</th>
          <th className="p-2">Links</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => {
          const name = [item.brand, item.model].filter(Boolean).join(' ') || item.id;
          return (
            <tr key={item.id} className="border-b last:border-0">
              <td className="p-2">{name}</td>
              <td className="p-2">{item.productType}</td>
              <td className="p-2">{item.generation}</td>
              <td className="p-2">{item.certificateNumber}</td>
              <td className="p-2">{item.certifiedSince}</td>
              <td className="p-2">{item.validUntil}</td>
              <td className="p-2">{item.gtin}</td>
              <td className="p-2 space-x-2">
                {item.detailUrl && (
                  <a
                    href={item.detailUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Detail
                  </a>
                )}
                {item.certificateUrl && (
                  <a
                    href={item.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    PDF
                  </a>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
