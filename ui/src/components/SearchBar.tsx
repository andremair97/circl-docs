import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';
import Skeleton from './Skeleton';
import useSuggestions from '../hooks/useSuggestions';
import type { SuggestionProvider, Suggestion } from '../suggest/Provider';
import LocalSeedProvider from '../suggest/LocalSeedProvider';

// SearchBar provides a single input with typeahead suggestions using reusable states.
const defaultProvider = new LocalSeedProvider();

export default function SearchBar({
  provider = defaultProvider,
}: {
  provider?: SuggestionProvider;
}) {
  const [query, setQuery] = useState('');
  const { suggestions, loading, error } = useSuggestions(provider, query);
  const navigate = useNavigate();
  const [active, setActive] = useState(-1);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!query) return;
    navigate(`/results?type=product&q=${encodeURIComponent(query)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => (a + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => (a - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter' && active >= 0) {
      e.preventDefault();
      const s = suggestions[active];
      setQuery(s.title);
      navigate(`/results?type=${s.type}&q=${encodeURIComponent(s.title)}`);
    } else if (e.key === 'Escape') {
      setActive(-1);
      setQuery('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        placeholder="Search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(-1);
        }}
        onKeyDown={handleKeyDown}
        aria-activedescendant={
          active >= 0 ? `suggestion-${suggestions[active].id}` : undefined
        }
        aria-autocomplete="list"
        aria-controls="suggestions-list"
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
            <ul id="suggestions-list" role="listbox" className="list-none p-0">
              {suggestions.map((s: Suggestion, idx) => (
                <li
                  id={`suggestion-${s.id}`}
                  role="option"
                  aria-selected={idx === active}
                  key={s.id}
                  className={`cursor-pointer px-1 py-0.5 ${
                    idx === active ? 'bg-bg' : ''
                  }`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setQuery(s.title);
                    navigate(
                      `/results?type=${s.type}&q=${encodeURIComponent(s.title)}`
                    );
                  }}
                >
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
