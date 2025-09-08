import { CorpScore } from "@/src/lib/connectors/cdp/types"; // workspace alias clarifies source location

export default function CorpCard({ s }: { s: CorpScore }) {
  return (
    <div className="rounded-xl border p-3 flex items-center justify-between">
      <div>
        <div className="font-medium">{s.company}</div>
        <div className="text-sm text-gray-600">{s.year} • {s.theme.toUpperCase()}</div>
      </div>
      <div className="text-xl font-semibold">{s.score}</div>
    </div>
  );
}
