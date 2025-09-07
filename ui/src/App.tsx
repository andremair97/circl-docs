import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Results from './pages/Results';
import Search from './pages/Search';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Search />} />
        <Route path="/results" element={<Results />} />
      </Route>
    </Routes>
  );
}
