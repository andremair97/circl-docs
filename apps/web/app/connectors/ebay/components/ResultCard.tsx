import { EbayItem } from "@/src/lib/connectors/ebay/types";

function Chip({ children }: { children: React.ReactNode }) {
  return <span className="inline-block text-xs px-2 py-1 rounded bg-gray-100 border">{children}</span>;
}

// Card view highlighting key sustainability signals for an item.
export function ResultCard({ i }: { i: EbayItem }) {
  return (
    <div className="rounded-xl border p-3 flex gap-3">
      {i.image ? <img src={i.image} alt="" className="w-20 h-20 object-cover rounded" /> : <div className="w-20 h-20 bg-gray-50 rounded" />}
      <div className="flex-1">
        <div className="font-medium"><a href={i.url} target="_blank" rel="noreferrer">{i.title}</a></div>
        <div className="text-sm text-gray-600">
          {i.price ? `${i.price.value} ${i.price.currency}` : "—"} · {i.condition || "Condition unknown"}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {i.condition?.toUpperCase()?.includes("REFURB") && <Chip>Refurbished</Chip>}
          {i.condition?.toUpperCase()?.includes("USED") && <Chip>Used</Chip>}
          {i.pickupEligible && <Chip>Local pickup</Chip>}
          {i.freeReturns && <Chip>Free returns</Chip>}
          {i.seller?.topRated && <Chip>Top rated seller</Chip>}
        </div>
        <div className="text-xs text-gray-500 mt-1">{i.itemLocation}</div>
      </div>
    </div>
  );
}
