import { CertifiedProduct } from "@/app/../src/lib/connectors/ecolabels/types";
function Badge({ children }: { children: React.ReactNode }) {
  return <span className="inline-block text-xs px-2 py-1 rounded bg-gray-100 border">{children}</span>;
}
export default function ResultCard({ p }: { p: CertifiedProduct }) {
  return (
    <div className="rounded-xl border p-3">
      <div className="flex justify-between items-start gap-3">
        <div>
          <div className="font-medium">{p.name}</div>
          <div className="text-sm text-gray-600">
            {[p.brand, p.company].filter(Boolean).join(" • ")}
          </div>
        </div>
        <Badge>{p.provider === "EU_ECOLABEL" ? "EU Ecolabel" : "Green Seal"}</Badge>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {p.category && <Badge>{p.category}</Badge>}
        {p.country && <Badge>{p.country}</Badge>}
        {p.standardCode && <Badge>{p.standardCode}</Badge>}
        {p.licenceId && <Badge>Licence {p.licenceId}</Badge>}
      </div>
      {p.url && (
        <a href={p.url} target="_blank" rel="noreferrer" className="text-sm underline mt-2 inline-block">
          View details
        </a>
      )}
    </div>
  );
}
