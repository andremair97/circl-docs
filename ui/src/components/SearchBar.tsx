import { FormEvent, useEffect, useId, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';
import Skeleton from './Skeleton';
import type { Provider, Suggestion } from '../suggest/Provider';

interface SearchBarProps {
  provider: Provider;
}

// SearchBar provides a single input with pluggable typeahead suggestions.
export default function SearchBar({ provider }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [active, setActive] = useState(-1);
  const navigate = useNavigate();
  const abortRef = useRef<AbortController | null>(null);
  const timer = useRef<number>();
  const listId = useId();

  useEffect(() => {
    window.clearTimeout(timer.current);
    if (!query) {
      abortRef.current?.abort();
      setSuggestions([]);
      setLoading(false);
      setError(null);
      return;
    }

    timer.current = window.setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setLoading(true);
      try {
        const res = await provider.suggest(query, controller.signal);
        setSuggestions(res);
        setActive(-1);
        setError(null);
      } catch (err: any) {
        if (err.name !== 'AbortError') setError(err);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 200);
  }, [query, provider]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const chosen = suggestions[active]?.title || query;
    if (!chosen) return;
    navigate(`/results?q=${encodeURIComponent(chosen)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' && suggestions.length > 0) {
      e.preventDefault();
      setActive((i) => (i + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp' && suggestions.length > 0) {
      e.preventDefault();
      setActive((i) => (i - 1 + suggestions.length) % suggestions.length);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-72 rounded border-2 border-primary px-2 py-1"
        role="combobox"
        aria-autocomplete="list"
        aria-controls={listId}
        aria-activedescendant={
          active >= 0 ? `${listId}-item-${active}` : undefined
        }
      />
      {query && (
        <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded border border-soft-border bg-surface p-2 shadow">
          {loading && <Skeleton count={3} />}
          {error && <ErrorState title="Error loading" description={error.message} />}
          {!loading && !error && suggestions.length === 0 && (
            <EmptyState title="No suggestions" />
          )}
          {suggestions.length > 0 && (
            <ul id={listId} role="listbox" className="list-none p-0">
              {suggestions.map((s, idx) => (
                <li
                  id={`${listId}-item-${idx}`}
                  role="option"
                  aria-selected={idx === active}
                  key={s.id}
                  className={`px-1 py-0.5 ${
                    idx === active ? 'bg-bg' : 'hover:bg-bg'
                  }`}
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
