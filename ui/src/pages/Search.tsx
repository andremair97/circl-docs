import SearchBar from '../components/SearchBar';

// Landing page with centered SearchBar and green background.
export default function Search() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e6f4ea',
      }}
    >
      <SearchBar />
    </div>
  );
}
