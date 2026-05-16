import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup/a11y.ts'],
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      enabled: true,
      reporter: ['text', 'lcov', 'html'],
      include: ['src/**/*.{ts,tsx,js,jsx}'],
      exclude: ['node_modules', 'dist', 'coverage', 'src/**/*.d.{ts,js}'],
      reportsDirectory: 'coverage',
    },
  },
});
