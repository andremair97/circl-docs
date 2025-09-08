import { EbayItem } from "@/src/lib/connectors/ebay/types";

// Simple table layout to allow scanning multiple listings at once.
export function ResultTable({ items }: { items: EbayItem[] }) {
  return (
    <div className="overflow-x-auto border rounded-xl">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-50">
            <th className="text-left p-2">Title</th>
            <th className="text-left p-2">Price</th>
            <th className="text-left p-2">Condition</th>
            <th className="text-left p-2">Pickup</th>
            <th className="text-left p-2">Free returns</th>
            <th className="text-left p-2">Seller</th>
            <th className="text-left p-2">Location</th>
          </tr>
        </thead>
        <tbody>
          {items.map(i => (
            <tr key={i.id} className="border-t">
              <td className="p-2"><a href={i.url} target="_blank" rel="noreferrer" className="underline">{i.title}</a></td>
              <td className="p-2">{i.price ? `${i.price.value} ${i.price.currency}` : "—"}</td>
              <td className="p-2">{i.condition ?? "—"}</td>
              <td className="p-2">{i.pickupEligible ? "Yes" : "No"}</td>
              <td className="p-2">{i.freeReturns ? "Yes" : "No"}</td>
              <td className="p-2">{i.seller?.username ?? "—"}</td>
              <td className="p-2">{i.itemLocation ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
