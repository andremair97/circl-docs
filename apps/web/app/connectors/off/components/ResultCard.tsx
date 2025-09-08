import { OffProduct } from "@/src/lib/connectors/off/types";

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="inline-block text-xs px-2 py-1 rounded bg-gray-100 border">{children}</span>;
}

export function ResultCard({ p }: { p: OffProduct }) {
  return (
    <div className="rounded-xl border p-3 flex gap-3">
      {p.image ? <img src={p.image} alt="" className="w-20 h-20 object-cover rounded" /> : <div className="w-20 h-20 bg-gray-50 rounded" />}
      <div className="flex-1">
        <div className="font-medium">{p.name}</div>
        <div className="text-sm text-gray-600">{p.brands?.join(", ")}</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {p.nutriScore && <Badge>Nutri-Score {p.nutriScore.toUpperCase()}</Badge>}
          {p.ecoScore && <Badge>Eco-Score {p.ecoScore.toUpperCase()}</Badge>}
          {p.novaGroup && <Badge>NOVA {p.novaGroup}</Badge>}
          {p.labels?.length ? <Badge>{p.labels.length} labels</Badge> : null}
          {p.allergens && <Badge>Allergens</Badge>}
        </div>
      </div>
    </div>
  );
}
