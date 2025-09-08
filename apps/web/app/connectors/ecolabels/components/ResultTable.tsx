import { CertifiedProduct } from "@/src/lib/connectors/ecolabels/types"; // resolve shared types via alias

export default function ResultTable({ items }: { items: CertifiedProduct[] }) {
  return (
    <div className="overflow-x-auto border rounded-xl">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-50">
            <th className="text-left p-2">Name</th>
            <th className="text-left p-2">Brand/Company</th>
            <th className="text-left p-2">Provider</th>
            <th className="text-left p-2">Category</th>
            <th className="text-left p-2">Country</th>
            <th className="text-left p-2">Standard</th>
            <th className="text-left p-2">Licence</th>
            <th className="text-left p-2">Valid</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-2">{p.name}</td>
              <td className="p-2">{[p.brand, p.company].filter(Boolean).join(" / ")}</td>
              <td className="p-2">{p.provider === "EU_ECOLABEL" ? "EU" : "GS"}</td>
              <td className="p-2">{p.category ?? "-"}</td>
              <td className="p-2">{p.country ?? "-"}</td>
              <td className="p-2">{p.standardCode ?? "-"}</td>
              <td className="p-2">{p.licenceId ?? "-"}</td>
              <td className="p-2">
                {(p.validFrom ?? "-")} → {(p.validTo ?? "-")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
