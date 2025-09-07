import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Integration test for the search flow using local suggestion seeds and OFF mock
// adapter. No network stubbing required.
it('suggests results while typing and shows product cards on submit', async () => {
  const App = (await import('../App')).default;
  render(
    <MemoryRouter initialEntries={['/']}> 
      <App />
    </MemoryRouter>
  );
  const input = screen.getByPlaceholderText(/search/i);
  fireEvent.change(input, { target: { value: 'organic' } });
  await screen.findByText('Organic Coffee Beans');

  fireEvent.submit(input.closest('form')!);
  const cards = await screen.findAllByTestId('product-card');
  expect(cards.length).toBeGreaterThan(0);
});

