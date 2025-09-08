import { BcorpCompany } from "@/src/lib/connectors/bcorp/types"; // use alias to avoid brittle relative paths

// Tabular view complements cards for users who prefer dense data layouts.
export function ResultTable({ items }: { items: BcorpCompany[] }) {
  return (
    <div className="overflow-x-auto border rounded-xl">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-50">
            <th className="text-left p-2">Name</th>
            <th className="text-left p-2">Status</th>
            <th className="text-left p-2">B Impact</th>
            <th className="text-left p-2">Industry</th>
            <th className="text-left p-2">Location</th>
            <th className="text-left p-2">Employees</th>
            <th className="text-left p-2">Certified</th>
          </tr>
        </thead>
        <tbody>
          {items.map((c) => (
            <tr key={c.id} className="border-t">
              <td className="p-2">{c.name}</td>
              <td className="p-2">{c.status ?? "-"}</td>
              <td className="p-2">{typeof c.bImpactScore === "number" ? Math.round(c.bImpactScore) : "-"}</td>
              <td className="p-2">{c.industries?.join(", ") ?? "-"}</td>
              <td className="p-2">{[c.city, c.country].filter(Boolean).join(", ") || "-"}</td>
              <td className="p-2">{c.employeesRange ?? "-"}</td>
              <td className="p-2">{c.certificationDate?.slice(0,10) ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
