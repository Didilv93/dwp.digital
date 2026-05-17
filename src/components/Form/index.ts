import './style.sass';
import {
  validateForm,
  validateName,
  validateEmail,
  validateDateOfBirth,
  validatePhone,
  ValidationResult,
} from '../../utils/validation';

export interface SubmissionData {
  name: string;
  email: string;
  dateOfBirth: string;
  phone: string;
}

export type SubmitHandler = (data: SubmissionData) => void;

interface FormComponent {
  element: HTMLElement;
}

interface FieldParts {
  field: HTMLDivElement;
  input: HTMLInputElement;
  errorEl: HTMLSpanElement;
}

function createField(
  labelText: string,
  inputType: string,
  inputName: string,
  placeholder: string,
): FieldParts {
  const field = document.createElement('div');
  field.className = 'form-field';

  const label = document.createElement('label');
  label.htmlFor = inputName;
  label.textContent = labelText;

  const errorEl = document.createElement('span');
  errorEl.id = `error-${inputName}`;
  errorEl.className = 'field-error';

  const input = document.createElement('input');
  input.type = inputType;
  input.id = inputName;
  input.name = inputName;
  input.placeholder = placeholder;
  input.autocomplete = 'off';
  input.setAttribute('aria-describedby', `error-${inputName}`);

  field.append(label, errorEl, input);
  return { field, input, errorEl };
}

export function createForm(onSubmit: SubmitHandler): FormComponent {
  const form = document.createElement('form');
  form.className = 'contact-form';
  form.noValidate = true;

  const errorBox = document.createElement('div');
  errorBox.className = 'form-errors';
  errorBox.setAttribute('aria-live', 'polite');
  errorBox.setAttribute('tabindex', '-1');

  const { field: nameField, input: nameInput, errorEl: nameErrorEl } = createField(
    'Full name', 'text', 'fullName', 'Ex. John Doe',
  );
  const { field: emailField, input: emailInput, errorEl: emailErrorEl } = createField(
    'Email', 'email', 'email', 'Ex. name@example.com',
  );
  const { field: dobField, input: dobInput, errorEl: dobErrorEl } = createField(
    'Date of birth', 'date', 'dateOfBirth', 'YYYY-MM-DD',
  );
  const { field: phoneField, input: phoneInput, errorEl: phoneErrorEl } = createField(
    'Phone number', 'tel', 'phone', 'Ex. +44 7123 456 789',
  );

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.className = 'submit-button';
  submitButton.textContent = 'Submit';

  form.append(errorBox, nameField, emailField, dobField, phoneField, submitButton);

  function buildSubmission() {
    return {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      dateOfBirth: dobInput.value,
      phone: phoneInput.value.trim(),
    };
  }

  function applyFieldError(
    input: HTMLInputElement,
    errorEl: HTMLSpanElement,
    check: string | true,
  ) {
    const invalid = check !== true;
    input.setAttribute('aria-invalid', String(invalid));
    errorEl.textContent = invalid ? check : '';
  }

  function clearFieldErrors() {
    [nameInput, emailInput, dobInput, phoneInput].forEach((input) =>
      input.removeAttribute('aria-invalid'),
    );
    [nameErrorEl, emailErrorEl, dobErrorEl, phoneErrorEl].forEach((el) => {
      el.textContent = '';
    });
  }

  function showSummary(result: ValidationResult) {
    errorBox.innerHTML = '';
    errorBox.classList.toggle('has-error', !result.valid);

    if (!result.valid) {
      const list = document.createElement('ul');
      list.className = 'error-list';
      result.messages.forEach((message) => {
        const item = document.createElement('li');
        item.textContent = message;
        list.appendChild(item);
      });
      errorBox.appendChild(list);
      errorBox.focus();
      return;
    }

    const success = document.createElement('p');
    success.className = 'success-message';
    success.textContent = 'Valid data. Submission has been added.';
    errorBox.appendChild(success);
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const submission = buildSubmission();

    const nameCheck = validateName(submission.name);
    const emailCheck = validateEmail(submission.email);
    const dobCheck = validateDateOfBirth(submission.dateOfBirth);
    const phoneCheck = validatePhone(submission.phone);

    applyFieldError(nameInput, nameErrorEl, nameCheck);
    applyFieldError(emailInput, emailErrorEl, emailCheck);
    applyFieldError(dobInput, dobErrorEl, dobCheck);
    applyFieldError(phoneInput, phoneErrorEl, phoneCheck);

    const validation = validateForm(submission);
    showSummary(validation);

    if (!validation.valid) {
      return;
    }

    clearFieldErrors();
    onSubmit(submission);
    form.reset();
  });

  return { element: form };
}
