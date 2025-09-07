import { Route, Routes } from 'react-router-dom';
import Results from './pages/Results';
import Search from './pages/Search';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Search />} />
      <Route path="/results" element={<Results />} />
    </Routes>
  );
}
