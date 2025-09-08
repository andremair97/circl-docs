import { CityEmission } from "@/app/../src/lib/connectors/cdp/types";

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="inline-block text-xs px-2 py-1 rounded bg-gray-100 border">{children}</span>;
}

export default function CityCard({ item }: { item: CityEmission }) {
  return (
    <div className="rounded-xl border p-3 flex flex-col gap-2">
      <div className="text-base font-medium">{item.city}{item.country ? `, ${item.country}` : ""}</div>
      <div className="text-sm text-gray-600">{item.year ?? "—"}</div>
      <div className="flex flex-wrap gap-2">
        {item.totalEmissionsTCO2e !== undefined && <Badge>Total {Math.round(item.totalEmissionsTCO2e).toLocaleString()} tCO₂e</Badge>}
        {item.perCapitaTCO2e !== undefined && <Badge>Per-capita {item.perCapitaTCO2e}</Badge>}
        {item.scope && <Badge>{item.scope}</Badge>}
      </div>
      {item.inventoryMethod && <div className="text-xs text-gray-500">Method: {item.inventoryMethod}</div>}
    </div>
  );
}
