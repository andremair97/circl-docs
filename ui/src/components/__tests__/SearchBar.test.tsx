import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import type { Provider } from '../../suggest/Provider';

const navigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const mod = await importOriginal<{}>();
  return { ...mod, useNavigate: () => navigate };
});
import SearchBar from '../SearchBar';

describe('SearchBar', () => {
  it('shows suggestions from provider and supports keyboard navigation', async () => {
    const provider: Provider = {
      suggest: vi.fn().mockResolvedValue([
        { id: '1', title: 'Alpha' },
        { id: '2', title: 'Beta' }
      ])
    };
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <SearchBar provider={provider} />
      </MemoryRouter>
    );
    const input = screen.getByPlaceholderText(/search/i);
    await user.type(input, 'a');
    const first = await screen.findByText('Alpha');
    await user.type(input, '{arrowdown}');
    expect(first).toHaveAttribute('aria-selected', 'true');
    expect(input).toHaveAttribute('aria-activedescendant', first.id);
    await user.type(input, '{enter}');
    expect(navigate).toHaveBeenCalledWith('/results?q=Alpha');
  });
});
