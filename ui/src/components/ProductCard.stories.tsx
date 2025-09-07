import type { Meta, StoryObj } from '@storybook/react';
import ProductCard from './ProductCard';
import type { Product } from '../types/Product';

const sample: Product = {
  id: '1',
  title: 'Sample Product',
  brand: 'Sample Brand',
  image: 'https://via.placeholder.com/150',
  badges: ['Eco-Score A', 'Organic'],
  metrics: {},
};

const meta: Meta<typeof ProductCard> = {
  title: 'Components/ProductCard',
  component: ProductCard,
};
export default meta;

export const WithImage: StoryObj<typeof ProductCard> = {
  args: { product: sample },
};

export const WithoutImage: StoryObj<typeof ProductCard> = {
  args: {
    product: { ...sample, id: '2', image: undefined },
  },
};

export const EcoBadges: StoryObj<typeof ProductCard> = {
  args: {
    product: { ...sample, id: '3', badges: ['Eco-Score B', 'Organic'] },
  },
};

