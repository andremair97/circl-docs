import { LotItem } from '@/src/lib/connectors/lot/types';

export function ItemTable({ items }: { items: LotItem[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Category</th>
            <th className="p-2 text-left">£/day</th>
            <th className="p-2 text-left">Deposit</th>
            <th className="p-2 text-left">Next available</th>
            <th className="p-2 text-left">CO₂e saved</th>
            <th className="p-2 text-left">Link</th>
          </tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <tr key={i.id} className="border-t">
              <td className="p-2">{i.name}</td>
              <td className="p-2">{i.category ?? '—'}</td>
              <td className="p-2">
                {typeof i.dailyPrice === 'number'
                  ? i.dailyPrice.toFixed(2)
                  : '—'}
              </td>
              <td className="p-2">
                {typeof i.deposit === 'number'
                  ? i.deposit.toFixed(0)
                  : '—'}
              </td>
              <td className="p-2">
                {i.nextAvailable
                  ? new Date(i.nextAvailable).toLocaleDateString()
                  : '—'}
              </td>
              <td className="p-2">
                {typeof i.co2eSavedKg === 'number'
                  ? `${i.co2eSavedKg} kg`
                  : '—'}
              </td>
              <td className="p-2">
                {i.link ? (
                  <a
                    className="underline"
                    href={i.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open
                  </a>
                ) : (
                  '—'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
