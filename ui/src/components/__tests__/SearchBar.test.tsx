import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { vi } from 'vitest';
import SearchBar from '../SearchBar';
import type { SuggestProvider, Suggestion } from '../../suggest/Provider';

describe('SearchBar', () => {
  it('allows keyboard navigation between suggestions', async () => {
    const provider: SuggestProvider = {
      suggest: vi.fn(async () => [
        { id: '1', title: 'Refurbished Laptop', type: 'product' },
        { id: '2', title: 'Patagonia', type: 'company' },
      ]),
    };
    render(
      <MemoryRouter>
        <SearchBar provider={provider} />
      </MemoryRouter>
    );
    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: 're' } });
    await screen.findByText('Refurbished Laptop');
    const items = screen.getAllByTestId('suggestion-item');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(items[0]).toHaveClass('bg-bg');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(items[1]).toHaveClass('bg-bg');
  });

  it('debounces and cancels stale requests', () => {
    vi.useFakeTimers();
    const provider: SuggestProvider = {
      suggest: vi.fn().mockResolvedValue([]),
    };
    render(
      <MemoryRouter>
        <SearchBar provider={provider} />
      </MemoryRouter>
    );
    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: 'p' } });
    fireEvent.change(input, { target: { value: 'pa' } });
    vi.advanceTimersByTime(200);
    expect(provider.suggest).toHaveBeenCalledTimes(1);
    expect(provider.suggest).toHaveBeenCalledWith('pa', expect.any(AbortSignal));
    vi.useRealTimers();
  });

  it('routes to results with type on selection', async () => {
    const provider: SuggestProvider = {
      suggest: vi.fn(async () => [
        { id: '1', title: 'Refurbished Laptop', type: 'product' },
      ]),
    };
    let loc: ReturnType<typeof useLocation>;
    const Wrapper = ({ children }: { children: React.ReactNode }) => {
      loc = useLocation();
      return <>{children}</>;
    };
    render(
      <MemoryRouter>
        <Wrapper>
          <SearchBar provider={provider} />
        </Wrapper>
      </MemoryRouter>
    );
    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: 'ref' } });
    await screen.findByText('Refurbished Laptop');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(loc!.pathname + loc!.search).toBe(
      '/results?q=Refurbished%20Laptop&type=product'
    );
  });
});
