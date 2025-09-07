import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';
import Skeleton from './Skeleton';
import useMockSearch from '../hooks/useMockSearch';

// SearchBar provides a single input with typeahead suggestions using reusable states.
export default function SearchBar() {
  const [query, setQuery] = useState('');
  const { results: suggestions, loading, error } = useMockSearch(query);
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!query) return;
    navigate(`/results?q=${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-72 rounded border-2 border-primary px-2 py-1"
      />
      {query && (
        <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded border border-soft-border bg-surface p-2 shadow">
          {loading && <Skeleton count={3} />}
          {error && <ErrorState title="Error loading" description={error.message} />}
          {!loading && !error && suggestions.length === 0 && (
            <EmptyState title="No suggestions" />
          )}
          {suggestions.length > 0 && (
            <ul className="list-none p-0">
              {suggestions.map((s) => (
                <li key={s.id} className="px-1 py-0.5 hover:bg-bg">
                  {s.title}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </form>
  );
}
