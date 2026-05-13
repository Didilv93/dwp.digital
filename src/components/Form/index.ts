import './style.sass';
import { validateForm, ValidationResult } from '../../utils/validation';

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

function createField(labelText: string, inputType: string, inputName: string, placeholder: string) {
  const field = document.createElement('div');
  field.className = 'form-field';

  const label = document.createElement('label');
  label.htmlFor = inputName;
  label.textContent = labelText;

  const input = document.createElement('input');
  input.type = inputType;
  input.id = inputName;
  input.name = inputName;
  input.placeholder = placeholder;
  input.autocomplete = 'off';

  field.append(label, input);
  return { field, input };
}

export function createForm(onSubmit: SubmitHandler): FormComponent {
  const form = document.createElement('form');
  form.className = 'contact-form';
  form.noValidate = true;

  const errorBox = document.createElement('div');
  errorBox.className = 'form-errors';
  errorBox.setAttribute('aria-live', 'polite');

  const { field: nameField, input: nameInput } = createField('Full name', 'text', 'fullName', 'Ex. John Doe');
  const { field: emailField, input: emailInput } = createField('Email', 'email', 'email', 'Ex. name@example.com');
  const { field: dobField, input: dobInput } = createField('Date of birth', 'date', 'dateOfBirth', 'YYYY-MM-DD');
  const { field: phoneField, input: phoneInput } = createField('Phone number', 'tel', 'phone', 'Ex. +44 7123 456 789');

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

  function showErrors(result: ValidationResult) {
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
    const validation = validateForm(submission);
    showErrors(validation);

    if (!validation.valid) {
      return;
    }

    onSubmit(submission);
    form.reset();
  });

  return { element: form };
}
