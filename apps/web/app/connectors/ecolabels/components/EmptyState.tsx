export default function EmptyState({ label }: { label: string }) {
  return <div className="text-sm text-gray-600 border rounded-xl p-4">No {label} results yet. Try another search.</div>;
}
