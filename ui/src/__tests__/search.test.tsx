import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

const mockData = {
  items: [
    {
      id: 'p1',
      title: 'Refurbished Laptop',
      source: 'MockSource',
      description: 'A reused laptop in good condition.'
    },
    {
      id: 'p2',
      title: 'Local Repair Shop',
      source: 'MockSource',
      description: 'Nearby repair service.'
    }
  ]
};

describe('mock search flow', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('suggests results while typing and shows cards on submit', async () => {
    vi.stubEnv('VITE_ENABLE_MOCK_SEARCH', 'true');
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({ json: () => Promise.resolve(mockData) }) as any
    ));
    const App = (await import('../App')).default;
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: 'Ref' } });
    await screen.findByText('Refurbished Laptop');

    fireEvent.submit(input.closest('form')!);
    const cards = await screen.findAllByTestId('result-card');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('renders error state when fetch fails', async () => {
    vi.stubEnv('VITE_ENABLE_MOCK_SEARCH', 'true');
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('fail'))));
    const App = (await import('../App')).default;
    render(
      <MemoryRouter initialEntries={['/results?q=test']}>
        <App />
      </MemoryRouter>
    );
    await screen.findByText(/something went wrong/i);
  });
});
