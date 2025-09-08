import { CityEmission } from "@/app/../src/lib/connectors/cdp/types";

export default function CityTable({ rows }: { rows: CityEmission[] }) {
  return (
    <div className="overflow-x-auto border rounded-xl">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-2 text-left">City</th>
            <th className="p-2 text-left">Country</th>
            <th className="p-2 text-left">Year</th>
            <th className="p-2 text-left">Total tCO₂e</th>
            <th className="p-2 text-left">Per-capita</th>
            <th className="p-2 text-left">Scope</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r=>(
            <tr key={r.id} className="border-t">
              <td className="p-2">{r.city}</td>
              <td className="p-2">{r.country ?? "-"}</td>
              <td className="p-2">{r.year ?? "-"}</td>
              <td className="p-2">{r.totalEmissionsTCO2e !== undefined ? Math.round(r.totalEmissionsTCO2e).toLocaleString() : "-"}</td>
              <td className="p-2">{r.perCapitaTCO2e ?? "-"}</td>
              <td className="p-2">{r.scope ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
