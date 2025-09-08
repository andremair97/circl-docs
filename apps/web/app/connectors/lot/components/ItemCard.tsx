import { LotItem } from '@/src/lib/connectors/lot/types';

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded border bg-gray-100 px-2 py-1 text-xs">
      {children}
    </span>
  );
}

export function ItemCard({ item }: { item: LotItem }) {
  return (
    <div className="flex gap-3 rounded-xl border p-3">
      {item.image ? (
        <img
          src={item.image}
          alt=""
          className="h-20 w-20 rounded object-cover"
        />
      ) : (
        <div className="h-20 w-20 rounded bg-gray-50" />
      )}
      <div className="flex-1">
        <div className="font-medium">{item.name}</div>
        <div className="text-sm text-gray-600">{item.category ?? '—'}</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {typeof item.dailyPrice === 'number' && (
            <Badge>£{item.dailyPrice.toFixed(2)}/day</Badge>
          )}
          {typeof item.deposit === 'number' && (
            <Badge>Deposit £{item.deposit.toFixed(0)}</Badge>
          )}
          {item.nextAvailable && (
            <Badge>
              Next: {new Date(item.nextAvailable).toLocaleDateString()}
            </Badge>
          )}
          {typeof item.co2eSavedKg === 'number' && (
            <Badge>~{item.co2eSavedKg} kg CO₂e saved</Badge>
          )}
        </div>
        {item.link && (
          <a
            className="mt-2 inline-block text-sm underline"
            href={item.link}
            target="_blank"
            rel="noreferrer"
          >
            View item
          </a>
        )}
      </div>
    </div>
  );
}
