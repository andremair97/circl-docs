import SearchBar from '@/src/components/SearchBar';
import Link from 'next/link';

// Landing page nudges users to start with a sustainability-focused search.
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-4 text-center">
      <h1 className="text-4xl font-bold">Circl</h1>
      <p className="text-lg text-gray-600">Sustainable shopping made simple</p>
      <SearchBar />
      {/* Link provides navigation to the connectors hub so users can discover available integrations */}
      <Link href="/connectors" className="text-sm text-blue-600 hover:underline">
        Browse connectors
      </Link>
    </main>
  );
}
