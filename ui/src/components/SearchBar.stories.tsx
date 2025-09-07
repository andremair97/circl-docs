import type { Meta, StoryObj } from '@storybook/react';
import SearchBar from './SearchBar';
import { LocalSeedProvider } from '../suggest/LocalSeedProvider';

const meta: Meta<typeof SearchBar> = {
  title: 'Components/SearchBar',
  component: SearchBar,
};
export default meta;

export const Basic: StoryObj<typeof SearchBar> = {
  render: () => <SearchBar provider={new LocalSeedProvider()} />,
};
