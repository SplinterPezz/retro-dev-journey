import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Smoke test: the whole app (store, persistence, router, home page) mounts.
// The home page waits for its background image, which never loads in jsdom.
test('renders the home page', async () => {
  render(<App />);
  expect(await screen.findByText(/loading/i)).toBeInTheDocument();
});
