export const TEMPLATE_HTML = `
<template id="submission-item-template">
  <li class="submission-item">
    <div class="submission-info">
      <strong data-field="name"></strong>
      <span data-field="email"></span>
      <span data-field="dateOfBirth"></span>
      <span data-field="phone"></span>
    </div>
    <button type="button" class="remove-button">Remove</button>
  </li>
</template>`;

export const FORM_HTML = `
<form id="contact-form" class="contact-form" novalidate>
  <div class="form-errors" aria-live="polite" tabindex="-1"></div>
  <div class="form-field">
    <label for="fullName">Full name</label>
    <span class="field-error" id="error-fullName"></span>
    <input type="text" id="fullName" name="fullName" placeholder="Ex. John Doe"
      autocomplete="name" aria-describedby="error-fullName" />
  </div>
  <div class="form-field">
    <label for="email">Email</label>
    <span class="field-error" id="error-email"></span>
    <input type="email" id="email" name="email" placeholder="Ex. name@example.com"
      autocomplete="email" aria-describedby="error-email" />
  </div>
  <div class="form-field">
    <label for="dateOfBirth">Date of birth</label>
    <span class="field-error" id="error-dateOfBirth"></span>
    <input type="date" id="dateOfBirth" name="dateOfBirth"
      autocomplete="bday" aria-describedby="error-dateOfBirth" />
  </div>
  <div class="form-field">
    <label for="phone">Phone number</label>
    <span class="field-error" id="error-phone"></span>
    <input type="tel" id="phone" name="phone" placeholder="Ex. +44 7123 456 789"
      autocomplete="tel" aria-describedby="error-phone" />
  </div>
  <button type="submit" class="submit-button">Submit</button>
</form>`;

export const LIST_HTML = `
${TEMPLATE_HTML}
<section class="submission-list-shell" aria-labelledby="submission-list-title">
  <h2 id="submission-list-title">Recent submissions</h2>
  <ul id="submission-list" class="submission-list"></ul>
</section>`;

export const PAGE_HTML = `
<main class="app-shell">
  <h1>Contact Form</h1>
  <p>Enter your details below and see saved submissions on this page.</p>
  ${FORM_HTML}
  ${LIST_HTML}
</main>`;
