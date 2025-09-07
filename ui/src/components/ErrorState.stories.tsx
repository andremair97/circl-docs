import type { Meta, StoryObj } from '@storybook/react';
import ErrorState from './ErrorState';

const meta: Meta<typeof ErrorState> = {
  title: 'Components/ErrorState',
  component: ErrorState,
};
export default meta;

export const Basic: StoryObj<typeof ErrorState> = {
  args: {
    title: 'Failed to load',
    description: 'Please retry',
  },
};

export const WithRetry: StoryObj<typeof ErrorState> = {
  args: {
    title: 'Error',
    description: 'Something went wrong',
    onRetry: () => alert('retry'),
  },
};
