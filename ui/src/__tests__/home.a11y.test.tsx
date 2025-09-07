import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

// Smoke test ensuring focus starts at skip link then search field.
it('focus order begins with skip link then search', async () => {
  const App = (await import('../App')).default;
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );
  const user = userEvent.setup();
  await user.tab();
  expect(screen.getByText(/skip to content/i)).toHaveFocus();
  await user.tab();
  expect(screen.getByPlaceholderText(/search/i)).toHaveFocus();
});
