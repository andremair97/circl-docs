import { render, screen } from '@testing-library/react';
import { Search } from 'lucide-react';
import EmptyState from '../EmptyState';

// Snapshot and rendering test for EmptyState component.
it('renders icon, text, and action', () => {
  const { container } = render(
    <EmptyState
      icon={<Search data-testid="icon" />}
      title="No items"
      description="nothing to see"
      action={<button>act</button>}
    />
  );
  expect(screen.getByTestId('icon')).toBeInTheDocument();
  expect(screen.getByText('No items')).toBeInTheDocument();
  expect(screen.getByText('nothing to see')).toBeInTheDocument();
  expect(screen.getByText('act')).toBeInTheDocument();
  expect(container).toMatchSnapshot();
});
