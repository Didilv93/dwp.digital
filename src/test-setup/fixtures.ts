import FORM_HTML from '../components/Form/index.html?raw';
import LIST_HTML from '../components/SubmissionList/index.html?raw';

export { FORM_HTML, LIST_HTML };

export const PAGE_HTML = `
<main class="app-shell">
  <h1>Contact Form</h1>
  <p>Enter your details below and see saved submissions on this page.</p>
  <div id="form-mount">${FORM_HTML.trim()}</div>
  <div id="list-mount">${LIST_HTML.trim()}</div>
</main>`;
