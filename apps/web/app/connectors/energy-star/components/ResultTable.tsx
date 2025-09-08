import { EnergyStarProduct } from "@/src/lib/connectors/energy-star/types";

/**
 * Compact tabular representation for power users or dense comparisons.
 */
export function ResultTable({ items }: { items: EnergyStarProduct[] }) {
  return (
    <div className="overflow-x-auto border rounded-xl">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-50">
            <th className="text-left p-2">Brand</th>
            <th className="text-left p-2">Model</th>
            <th className="text-left p-2">Category</th>
            <th className="text-left p-2">Capacity</th>
            <th className="text-left p-2">kWh/yr</th>
            <th className="text-left p-2">Most Efficient</th>
            <th className="text-left p-2">Certified</th>
          </tr>
        </thead>
        <tbody>
          {items.map(p => (
            <tr key={p.id} className="border-t">
              <td className="p-2">{p.brand}</td>
              <td className="p-2">{p.model}</td>
              <td className="p-2">{p.category}</td>
              <td className="p-2">{p.capacity ?? "-"}</td>
              <td className="p-2">{typeof p.annualKwh === "number" ? p.annualKwh : "-"}</td>
              <td className="p-2">{p.mostEfficient ? "Yes" : "No"}</td>
              <td className="p-2">{p.certifiedDate ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
