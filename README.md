# DWP Digital — Front End Developer Coding Exercise

## Solution overview

The application is a single-page contact form built with **Vanilla TypeScript**, **Sass**, and **Vite** — no UI frameworks. The user fills in name, email, date of birth and phone number; on submission the data is validated with custom logic and appended to a list on the same page. Each entry can be removed individually.

The project follows a **component-based architecture** where each component owns its HTML template, behaviour and styles as co-located files:

```
src/
├── App/
│   └── style.sass                   # two-column desktop grid layout
├── components/
│   ├── Form/
│   │   ├── index.html               # form template (single source of truth)
│   │   ├── index.ts                 # validation, error summary, live region
│   │   └── style.sass
│   └── SubmissionList/
│       ├── index.html               # list template with <template> element
│       ├── index.ts                 # add / remove, focus management, announcements
│       └── style.sass
├── styles/
│   └── theme.sass                   # design tokens shared across components
├── utils/
│   └── validation.ts                # pure field validation functions
└── test-setup/                      # Vitest + axe-core global configuration
```

A custom **Vite plugin** reads each `index.html` at build time and inlines it into `index.html` at the root, eliminating layout shift and keeping component HTML as the single source of truth for both the browser and the test fixtures.

Accessibility was treated as a first-class concern throughout: WCAG 2.2 AA colour contrast, `aria-live` regions for form errors and list changes, focus management after item removal, and full `axe-core` automated scanning on every test run.

---

## Getting started

> **Note — files arrive with a `.txt` extension.**
> Before running anything, follow the instructions in [`RESTORE.md`](RESTORE.md) to rename all files back to their original extensions. `RESTORE.md` is the only file that keeps its extension on delivery and can be opened immediately.

### 1 · Install dependencies

```bash
npm install
```

### 2 · Start the development server

```bash
npm run dev
```

Open the URL shown in the terminal (e.g. `http://localhost:5173`).

### 3 · Build for production

```bash
npm run build
npm run preview
```

---

## Running tests

```bash
npm test                  # run all tests once
npm run test:watch        # watch mode during development
npm run test:coverage     # generate coverage report
```

Open `coverage/index.html` for the detailed coverage report.

The test suite includes **automated WCAG 2.2 AA scans** via `axe-core` on every component state (initial render, after submission, after removal, with validation errors).

## Linting

```bash
npm run lint              # check
npm run lint:fix          # check and auto-fix
```

## Technologies

| Layer | Choice |
|---|---|
| Language | TypeScript (strict) |
| Styles | Sass (component-scoped) |
| Bundler | Vite |
| Testing | Vitest + jsdom + vitest-axe |
| Accessibility | axe-core (WCAG 2.2 AA) |
| Frameworks | None |
