import { useMemo } from 'react';
import SearchBar from '../components/SearchBar';
import { LocalSeedProvider } from '../suggest/LocalSeedProvider';

// Landing page with centered SearchBar and themed background.
export default function Search() {
  const provider = useMemo(() => new LocalSeedProvider(), []);
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <SearchBar provider={provider} />
    </div>
  );
}
