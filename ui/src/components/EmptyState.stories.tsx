import type { Meta, StoryObj } from '@storybook/react';
import { Search } from 'lucide-react';
import EmptyState from './EmptyState';

const meta: Meta<typeof EmptyState> = {
  title: 'Components/EmptyState',
  component: EmptyState,
};
export default meta;

export const Basic: StoryObj<typeof EmptyState> = {
  args: {
    icon: <Search />,
    title: 'No results',
    description: 'Try a different query',
  },
};
