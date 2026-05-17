import { defineConfig } from 'vitest/config';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

function inlineComponentHTML() {
  const formHTML = readFileSync(resolve(__dirname, 'src/components/Form/index.html'), 'utf-8').trim();
  const listHTML = readFileSync(resolve(__dirname, 'src/components/SubmissionList/index.html'), 'utf-8').trim();

  return {
    name: 'inline-component-html',
    transformIndexHtml(html: string): string {
      return html
        .replace('<div id="form-mount"></div>', `<div id="form-mount">\n      ${formHTML.replace(/\n/g, '\n      ')}\n    </div>`)
        .replace('<div id="list-mount"></div>', `<div id="list-mount">\n      ${listHTML.replace(/\n/g, '\n      ')}\n    </div>`);
    },
  };
}

function inlineCSS() {
  let css = '';

  return {
    name: 'inline-css',
    apply: 'build' as const,
    generateBundle(_options: unknown, bundle: Record<string, any>) {
      for (const [name, chunk] of Object.entries(bundle)) {
        if (chunk.type === 'asset' && name.endsWith('.css')) {
          css += chunk.source as string;
          delete bundle[name];
        }
      }
    },
    transformIndexHtml: {
      order: 'post' as const,
      handler(html: string): string {
        if (!css) return html;
        return html
          .replace(/<link rel="stylesheet"[^>]*>\n?/g, '')
          .replace('</head>', `  <style>${css}</style>\n</head>`);
      },
    },
  };
}

export default defineConfig({
  plugins: [inlineComponentHTML(), inlineCSS()],
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
      exclude: ['node_modules', 'dist', 'coverage', 'src/**/*.d.{ts,js}', 'src/main.ts'],
      reportsDirectory: 'coverage',
    },
  },
});
