import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useMockSearch from '../hooks/useMockSearch';

// SearchBar provides a single input with basic typeahead suggestions.
export default function SearchBar() {
  const [query, setQuery] = useState('');
  const { results: suggestions } = useMockSearch(query);
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!query) return;
    navigate(`/results?q=${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
      <input
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          padding: '0.5rem',
          border: '2px solid #2e7d32',
          borderRadius: '4px',
          width: '300px',
        }}
      />
      {suggestions.length > 0 && (
        <ul
          style={{
            position: 'absolute',
            top: '2.5rem',
            left: 0,
            right: 0,
            background: '#fff',
            listStyle: 'none',
            margin: 0,
            padding: '0.5rem',
            border: '1px solid #ccc',
          }}
        >
          {suggestions.map((s) => (
            <li key={s.id}>{s.title}</li>
          ))}
        </ul>
      )}
    </form>
  );
}
