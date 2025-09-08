import { OffProduct } from "@/src/lib/connectors/off/types";

export function ResultTable({ items }: { items: OffProduct[] }) {
  return (
    <div className="overflow-x-auto border rounded-xl">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-50">
            <th className="text-left p-2">Name</th>
            <th className="text-left p-2">Brands</th>
            <th className="text-left p-2">Nutri</th>
            <th className="text-left p-2">Eco</th>
            <th className="text-left p-2">NOVA</th>
            <th className="text-left p-2">Labels</th>
            <th className="text-left p-2">Allergens</th>
          </tr>
        </thead>
        <tbody>
          {items.map(p => (
            <tr key={p.id} className="border-t">
              <td className="p-2">{p.name}</td>
              <td className="p-2">{p.brands?.join(", ")}</td>
              <td className="p-2">{p.nutriScore?.toUpperCase() ?? "-"}</td>
              <td className="p-2">{p.ecoScore?.toUpperCase() ?? "-"}</td>
              <td className="p-2">{p.novaGroup ?? "-"}</td>
              <td className="p-2">{p.labels?.length ?? 0}</td>
              <td className="p-2">{p.allergens ? "⚠︎" : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
