import SearchBar from '../components/SearchBar';

// Landing page with centered SearchBar and themed background.
export default function Search() {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <SearchBar />
    </div>
  );
}
