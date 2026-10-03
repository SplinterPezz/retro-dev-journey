// jest-dom matchers (toBeInTheDocument...) for Vitest.
import '@testing-library/jest-dom/vitest';

// jsdom has no matchMedia; the screen-orientation hooks read it.
if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}
