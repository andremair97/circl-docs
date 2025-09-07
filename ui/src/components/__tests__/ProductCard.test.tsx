import { render, screen } from '@testing-library/react';
import ProductCard from '../ProductCard';
import type { Product } from '../../types/Product';

const base: Product = {
  id: '1',
  title: 'Sample',
  brand: 'Brand',
  badges: [],
  metrics: {},
};

it('renders placeholder when image missing', () => {
  render(<ProductCard product={base} />);
  expect(screen.getByText(/no image/i)).toBeInTheDocument();
});

it('renders eco badges', () => {
  const product = { ...base, badges: ['Eco-Score A', 'Organic'] };
  render(<ProductCard product={product} />);
  expect(screen.getByText('Eco-Score A')).toBeInTheDocument();
  expect(screen.getByText('Organic')).toBeInTheDocument();
});

