import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Keep the variable names and .env files used since Create React App.
  envPrefix: 'REACT_APP_',
  server: {
    // the backend allows this origin (ALLOW_ORIGIN)
    port: 3000,
    strictPort: true,
  },
  optimizeDeps: {
    // Only imported lazily (code questions, mini games): pre-bundle them at startup,
    // or Vite finds them on first use, re-optimizes and the open page gets a 504.
    include: ['@uiw/react-codemirror', '@codemirror/lang-java'],
  },
  preview: {
    port: 3000,
  },
  build: {
    // the Dockerfile copies build/ into nginx
    outDir: 'build',
    // The admin dashboard chunk (MUI + ApexCharts) is ~800 kB but only loads on /admin.
    chunkSizeWarningLimit: 900,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
    css: true,
  },
});
