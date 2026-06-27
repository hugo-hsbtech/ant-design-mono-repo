import '@testing-library/jest-dom/vitest';

// Ant Design relies on matchMedia (responsive Grid, Drawer breakpoints). jsdom
// does not implement it, so provide a no-op shim for unit tests.
if (typeof window !== 'undefined' && !window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
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

// antd uses ResizeObserver (Table, Tabs ink-bar, etc.).
if (typeof globalThis !== 'undefined' && !('ResizeObserver' in globalThis)) {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
}
