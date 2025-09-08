'use client';
import { useRouter, useSearchParams } from 'next/navigation';

const options = [
  'All',
  'Display',
  'Notebook',
  'Tablet',
  'Desktop',
  'All-in-One PC',
  'Smartphone',
  'Headset',
  'Projector',
  'Server',
  'Data Center',
];

type Props = { selected?: string };

// Dropdown filter for product type categories.
export default function Filters({ selected = 'All' }: Props) {
  const router = useRouter();
  const params = useSearchParams();

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const next = new URLSearchParams(params.toString());
    if (value && value !== 'All') next.set('type', value);
    else next.delete('type');
    router.push(`/connectors/tco?${next.toString()}`);
  };

  return (
    <div className="mt-4">
      <label htmlFor="tco-type" className="mr-2 font-medium">
        Product type
      </label>
      <select
        id="tco-type"
        value={selected}
        onChange={onChange}
        className="rounded-md border px-2 py-1"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
