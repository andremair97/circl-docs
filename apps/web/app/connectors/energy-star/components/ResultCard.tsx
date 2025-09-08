import { EnergyStarProduct } from "@/src/lib/connectors/energy-star/types";

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="inline-block text-xs px-2 py-1 rounded bg-gray-100 border">{children}</span>;
}

/**
 * Card view highlights sustainability-relevant fields without overwhelming the user.
 */
export function ResultCard({ item }: { item: EnergyStarProduct }) {
  return (
    <div className="rounded-xl border p-3 flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <div className="font-medium">{item.brand} {item.model}</div>
        <Badge>{item.category}</Badge>
      </div>
      <div className="text-sm text-gray-600">{item.capacity ?? "—"}</div>
      <div className="flex flex-wrap gap-2 mt-1">
        {typeof item.annualKwh === "number" && <Badge>{item.annualKwh} kWh/yr</Badge>}
        {item.mostEfficient && <Badge>Most Efficient</Badge>}
        {item.certifiedDate && <Badge>Certified {item.certifiedDate}</Badge>}
      </div>
      {item.productUrl && (
        <a className="text-sm underline mt-1" href={item.productUrl} target="_blank" rel="noreferrer">Product page</a>
      )}
    </div>
  );
}
