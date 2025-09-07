import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import ErrorState from '../ErrorState';

// Snapshot and behavior test for ErrorState component.
it('invokes retry handler when provided', async () => {
  const retry = vi.fn();
  const { container } = render(
    <ErrorState title="oops" description="fail" onRetry={retry} />
  );
  const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name: /retry/i }));
  expect(retry).toHaveBeenCalled();
  expect(container).toMatchSnapshot();
});
