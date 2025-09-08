import { FairtradeEntity } from '@/src/lib/connectors/fairtrade/types';

// Tabular view for scanning more results at once.
export function ResultTable({ items }: { items: FairtradeEntity[] }) {
  return (
    <table className="w-full text-sm border">
      <thead className="bg-gray-50">
        <tr>
          <th className="p-2 text-left">Name</th>
          <th className="p-2 text-left">Country</th>
          <th className="p-2 text-left">Type</th>
          <th className="p-2 text-left">Categories</th>
          <th className="p-2 text-left">ID</th>
        </tr>
      </thead>
      <tbody>
        {items.map((e) => (
          <tr key={e.id} className="border-t">
            <td className="p-2">{e.name}</td>
            <td className="p-2">{e.country ?? '-'}</td>
            <td className="p-2">{e.entityType ?? '-'}</td>
            <td className="p-2">{e.categories.join(', ')}</td>
            <td className="p-2">{e.id}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
