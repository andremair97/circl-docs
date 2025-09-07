import { render, screen } from '@testing-library/react';
import ProductCard from '../ProductCard';
import type { Product } from '../../mappers/offToProduct';

describe('ProductCard', () => {
  const base: Product = {
    id: '1',
    title: 'Test Product',
    brand: 'Brand',
    image: 'https://via.placeholder.com/150',
    badges: [],
    metrics: {},
  };

  it('renders placeholder when image missing', () => {
    render(<ProductCard product={{ ...base, image: undefined }} />);
    expect(screen.getByTestId('image-placeholder')).toBeInTheDocument();
  });

  it('renders badges', () => {
    render(<ProductCard product={{ ...base, badges: ['Eco-Score A', 'Organic'] }} />);
    const badges = screen.getAllByTestId('badge');
    expect(badges).toHaveLength(2);
  });
});
