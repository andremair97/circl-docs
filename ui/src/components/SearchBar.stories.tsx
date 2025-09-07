import type { Meta, StoryObj } from '@storybook/react';
import SearchBar from './SearchBar';
import LocalSeedProvider from '../suggest/LocalSeedProvider';
import type { SuggestProvider } from '../suggest/Provider';

const providers: Record<string, SuggestProvider> = {
  local: new LocalSeedProvider(),
  empty: { suggest: async () => [] },
};

const meta: Meta<typeof SearchBar> = {
  title: 'Components/SearchBar',
  component: SearchBar,
  argTypes: {
    provider: {
      options: Object.keys(providers),
      mapping: providers,
      control: { type: 'radio' },
    },
  },
  args: {
    provider: providers.local,
  },
};
export default meta;

type Story = StoryObj<typeof SearchBar>;

export const Basic: Story = {};

export const Loading: Story = {
  args: {
    provider: {
      suggest: () => new Promise(() => {}), // never resolves to show loading state
    },
  },
};

export const Empty: Story = {
  args: {
    provider: providers.empty,
  },
};
