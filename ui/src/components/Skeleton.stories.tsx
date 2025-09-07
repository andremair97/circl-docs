import type { Meta, StoryObj } from '@storybook/react';
import Skeleton from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Skeleton',
  component: Skeleton,
};
export default meta;

export const Rows: StoryObj<typeof Skeleton> = {
  args: { variant: 'rows', count: 3 },
};

export const Cards: StoryObj<typeof Skeleton> = {
  args: { variant: 'cards', count: 2 },
};
