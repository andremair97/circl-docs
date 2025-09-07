import type { Meta, StoryObj } from '@storybook/react';
import ProductCard from './ProductCard';
import type { Product } from '../mappers/offToProduct';

const meta: Meta<typeof ProductCard> = {
  title: 'Components/ProductCard',
  component: ProductCard,
};
export default meta;

const base: Product = {
  id: '1',
  title: 'Organic Apple',
  brand: 'Green Farms',
  image: 'https://via.placeholder.com/150',
  badges: ['Eco-Score A', 'Organic'],
  metrics: {},
};

export const WithImage: StoryObj<typeof ProductCard> = {
  args: {
    product: base,
  },
};

export const MissingImage: StoryObj<typeof ProductCard> = {
  args: {
    product: { ...base, image: undefined, badges: ['Eco-Score C', 'Organic'] },
  },
};
