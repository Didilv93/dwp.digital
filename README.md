# DWP Digital - Front End Developer Coding Exercise

This repository contains the solution for the DWP Digital Front End Developer technical exercise.

## Objective
The application is a single-page interface where the user fills out a form with:
- Name
- Email
- Date of birth
- Phone number

On submission, the data is validated with custom logic and displayed below the form on the same page. Each new submission is appended to the list and can be removed individually.

## Project architecture
The application is structured with a modular component-based approach:
- `src/App/index.ts` — main application component
- `src/components/Form/index.ts` — form component and submission logic
- `src/components/SubmissionList/index.ts` — submissions list component with remove functionality
- `src/utils/validation.ts` — custom field validation
- `src/App/style.sass`, `src/components/Form/style.sass`, `src/components/SubmissionList/style.sass` — component-level Sass styles

## Technologies used
- Plain HTML in `index.html`
- Sass for component styles
- TypeScript for component logic
- Vite as the build and development tool
- Vitest for unit testing

## How to run
1. Install dependencies:
   - `npm install`
2. Start the development server:
   - `npm run dev`
3. Open the URL shown in the terminal (for example, `http://localhost:5173`).

## How to test
- Run all unit tests:
  - `npm test`
- Run coverage analysis:
  - `npm run test:coverage`
- Run lint across the source files:
  - `npm run lint`
- Run lint and automatically fix simple issues:
  - `npm run lint:fix`
- Run Vitest in watch mode during development:
  - `npm run test:watch`

## Coverage report
After running coverage, open `coverage/index.html` to inspect the detailed report.

## Delivery notes
- The final code should be zipped and submitted as requested.
- Rename code files to `.txt` before creating the zip file, as required by DWP.
- No UI framework was used; the application uses HTML, Sass, and vanilla JavaScript/TypeScript.

## Accessibility and compatibility
- Labels are properly associated with each form field.
- Error messages are presented accessibly.
- The form includes visible focus states and does not rely on native browser validation.
- The project is prepared to run in modern browsers according to DWP technology guidance.
