import { BcorpCompany } from "@/src/lib/connectors/bcorp/types"; // alias keeps tests and builds consistent

// Small badge helper for repeated metadata chips.
function Badge({ children }: { children: React.ReactNode }) {
  return <span className="inline-block text-xs px-2 py-1 rounded bg-gray-100 border">{children}</span>;
}

// Card view gives a quick visual overview of a company, useful on mobile.
export function ResultCard({ c }: { c: BcorpCompany }) {
  return (
    <div className="rounded-xl border p-3 flex gap-3">
      {c.logo ? (
        <img src={c.logo} alt="" className="w-16 h-16 object-contain rounded bg-white" />
      ) : (
        <div className="w-16 h-16 rounded bg-gray-50" />
      )}
      <div className="flex-1">
        <div className="font-medium">{c.name}</div>
        <div className="text-sm text-gray-600">
          {[c.city, c.country].filter(Boolean).join(", ")}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {c.status && <Badge>{c.status}</Badge>}
          {typeof c.bImpactScore === "number" && <Badge>B Impact {Math.round(c.bImpactScore)}</Badge>}
          {c.employeesRange && <Badge>{c.employeesRange}</Badge>}
          {c.industries?.length ? <Badge>{c.industries.slice(0,2).join(" • ")}</Badge> : null}
        </div>
        {c.website && (
          <a className="text-sm underline mt-2 inline-block" href={c.website} target="_blank" rel="noreferrer">
            Visit website
          </a>
        )}
      </div>
    </div>
  );
}
