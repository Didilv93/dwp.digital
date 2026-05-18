# DWP Digital — Front End Developer Coding Exercise

## Solution overview

A contact form built with **Vanilla TypeScript**, **Sass**, and **Vite**, no UI frameworks. The user fills in name, email, date of birth and phone number, on submission the data is validated with custom logic and appended to a list on the same page. Each entry can be removed individually.

Component HTML is pre-rendered at build time and inlined into `index.html`, the page is fully structured before any script runs. JavaScript adds behaviour on top of existing HTML, which means the form degrades gracefully when scripting is unavailable.

### Architecture

The project follows a component-based structure where each component owns its HTML template, behaviour, and styles as co-located files:

```
src/
├── App/
│   └── style.sass                   # global layout, skip link, noscript banner
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

A custom **Vite plugin** reads each `index.html` at build time and inlines it into the root `index.html`, eliminating layout shift and keeping component HTML as the single source of truth for both the browser and the test fixtures.

### Progressive enhancement

The form is layered so each level adds capability without breaking the one below:

| Layer             | Behaviour                                                  |
|-------------------|------------------------------------------------------------|
| HTML only         | Form renders with `action` and `method="post"`; `required` | 
|                   | attributes enable native browser validation; `<noscript>`  |
|                   | banner informs the user that JavaScript is needed;         |
| HTML + CSS        | Layout, typography, and visual states apply;               |
| HTML + CSS + JS   | `novalidate` is added programmatically so custom           |
|                   | validation takes over, submissions are appended to the     |
|                   | list without a page reload.                                |

### Accessibility

Accessibility was treated as a first-class concern throughout:

- Skip-to-content link as the first focusable element on the page
- WCAG 2.2 AA colour contrast throughout
- `aria-live` regions for form errors and list changes
- Focus management after item removal and on empty-state appearance
- `aria-invalid`, `aria-describedby`, and `autocomplete` on all form fields
- Full `axe-core` automated scanning on every component state in the test suite

---

## Getting started

> **Note — files arrive with a `.txt` extension.**
> Before running anything, follow the instructions in [`RESTORE.md.txt`](RESTORE.md.txt) to rename all files back to their original extensions.

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

---

## Linting

```bash
npm run lint              # check
npm run lint:fix          # check and auto-fix
```

---

## Performance

The Lighthouse CI configuration in `.lighthouserc.json` defines the performance budget:

|    Category    |    Threshold    |
|----------------|-----------------|
| Performance    | ≥ 90            |
| Accessibility  | 100 (hard fail) |
| Best practices | ≥ 90            |
| SEO            | ≥ 80            |

Run against a production build:

```bash
npm run lighthouse
```

---

## Technologies

| Layer         | Choice                      |
|---------------|-----------------------------|
| Language      | TypeScript (strict)         |
| Styles        | Sass (component-scoped)     |
| Bundler       | Vite                        |
| Testing       | Vitest + jsdom + vitest-axe |
| Accessibility | axe-core (WCAG 2.2 AA)      |
| Frameworks    | None                        |

---

## Browser support

Targets the [GOV.UK-required browser list](https://www.gov.uk/service-manual/technology/designing-for-different-browsers-and-devices) (updated February 2026). All APIs used (`querySelector`, `cloneNode`, `requestAnimationFrame`, `hidden`, CSS Grid, CSS Custom Properties) are natively supported across all targets without polyfills.

| Operating system | Browsers                                          |
|------------------|---------------------------------------------------|
| Windows          | Edge, Chrome, Firefox (latest stable)             |
| macOS            | Safari, Chrome, Firefox (latest stable)           |
| iOS              | Safari, Chrome, Edge (latest stable)              |
| Android          | Chrome, Samsung Internet, Firefox (latest stable) |

---

## Manual testing checklist

Automated axe-core catches ~30–40% of WCAG criteria. The following should be verified manually:

**Keyboard navigation**
- [ ] Tab through all form fields and buttons in logical order
- [ ] Skip link appears on first Tab press and moves focus to `<main>`
- [ ] Submit form with Enter key
- [ ] Remove a submission with Space/Enter on the Remove button
- [ ] Focus moves to the next Remove button (or empty state) after removal

**Screen reader (NVDA + Chrome / VoiceOver + Safari)**
- [ ] Error summary is announced on invalid submission
- [ ] Individual field errors are read when focusing each invalid input
- [ ] Live region announces removal and successful submission
- [ ] Empty state is announced when the last item is removed

**Zoom and reflow**
- [ ] All content readable at 200% browser zoom with no horizontal scroll
- [ ] Layout reflows to single column at 400% zoom (≈ 320 px viewport equivalent)
- [ ] No text is clipped or truncated at any zoom level

**High-contrast mode**
- [ ] Form and list remain usable with Windows High Contrast enabled
- [ ] Focus rings remain visible

**Progressive enhancement**
- [ ] With JavaScript disabled: `<noscript>` banner is visible and informative
- [ ] With JavaScript disabled: browser validates required fields before submission
- [ ] With JavaScript disabled: form submits via POST with no data exposed in the URL
