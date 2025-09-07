import { FormEvent, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';
import Skeleton from './Skeleton';
import type { SuggestProvider, Suggestion } from '../suggest/Provider';

interface Props {
  provider: SuggestProvider;
}

// SearchBar provides a single input with typeahead suggestions using pluggable providers.
export default function SearchBar({ provider }: Props) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [active, setActive] = useState(-1);
  const [open, setOpen] = useState(false);
  const timer = useRef<number>();
  const controller = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!query) {
      controller.current?.abort();
      setSuggestions([]);
      setOpen(false);
      return;
    }

    setOpen(true);
    window.clearTimeout(timer.current);
    controller.current?.abort();
    timer.current = window.setTimeout(async () => {
      const c = new AbortController();
      controller.current = c;
      setLoading(true);
      try {
        const res = await provider.suggest(query, c.signal);
        setSuggestions(res);
        setError(null);
      } catch (err: any) {
        if (err.name !== 'AbortError') setError(err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => {
      window.clearTimeout(timer.current);
      controller.current?.abort();
    };
  }, [query, provider]);

  const select = (s: Suggestion) => {
    navigate(`/results?q=${encodeURIComponent(s.title)}&type=${s.type}`);
    setOpen(false);
    setActive(-1);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (active >= 0 && suggestions[active]) {
      select(suggestions[active]);
      return;
    }
    if (!query) return;
    navigate(`/results?q=${encodeURIComponent(query)}`);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      if (active >= 0 && suggestions[active]) {
        e.preventDefault();
        select(suggestions[active]);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
      setActive(-1);
    }
  };

  const handleBlur = () => {
    setOpen(false);
    setActive(-1);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className="w-72 rounded border-2 border-primary px-2 py-1"
      />
      {open && (
        <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded border border-soft-border bg-surface p-2 shadow">
          {loading && <Skeleton count={3} />}
          {error && <ErrorState title="Error loading" description={error.message} />}
          {!loading && !error && suggestions.length === 0 && (
            <EmptyState title="No suggestions" />
          )}
          {suggestions.length > 0 && (
            <ul className="list-none p-0" role="listbox">
              {suggestions.map((s, i) => (
                <li
                  key={s.id}
                  data-testid="suggestion-item"
                  className={`px-1 py-0.5 hover:bg-bg ${i === active ? 'bg-bg' : ''}`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    select(s);
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
