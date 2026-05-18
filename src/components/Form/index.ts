import './style.sass';
import { validateName, validateEmail, validateDateOfBirth, validatePhone } from '../../utils/validation';

export interface SubmissionData {
  name: string;
  email: string;
  dateOfBirth: string;
  phone: string;
}

export type SubmitHandler = (data: SubmissionData) => void;

const FIELD_VALIDATORS: Array<{
  inputName: string;
  getVal: (s: SubmissionData) => string;
  validate: (value: string) => string | true;
}> = [
  { inputName: 'fullName',    getVal: (s) => s.name,        validate: validateName },
  { inputName: 'email',       getVal: (s) => s.email,       validate: validateEmail },
  { inputName: 'dateOfBirth', getVal: (s) => s.dateOfBirth, validate: validateDateOfBirth },
  { inputName: 'phone',       getVal: (s) => s.phone,       validate: validatePhone },
];

function getInput(form: HTMLFormElement, name: string): HTMLInputElement {
  return form.elements.namedItem(name) as HTMLInputElement;
}

function getErrorEl(form: HTMLFormElement, name: string): HTMLSpanElement {
  return form.querySelector<HTMLSpanElement>(`#error-${name}`)!;
}

function applyFieldState(input: HTMLInputElement, errorEl: HTMLSpanElement, result: string | true): void {
  const invalid = result !== true;
  input.setAttribute('aria-invalid', String(invalid));
  errorEl.textContent = invalid ? result : '';
}

function showSummary(errorBox: HTMLElement, errors: string[]): void {
  errorBox.innerHTML = '';
  errorBox.classList.toggle('has-error', errors.length > 0);

  if (errors.length > 0) {
    const ul = document.createElement('ul');
    ul.className = 'error-list';
    errors.forEach((msg) => {
      const li = document.createElement('li');
      li.textContent = msg;
      ul.appendChild(li);
    });
    errorBox.appendChild(ul);
    errorBox.focus();
    return;
  }

  const p = document.createElement('p');
  p.className = 'success-message';
  p.textContent = 'Valid data. Submission has been added.';
  errorBox.appendChild(p);
}

export function initForm(mount: HTMLElement, onSubmit: SubmitHandler): void {
  const form = mount.querySelector<HTMLFormElement>('form')!;
  const errorBox = form.querySelector<HTMLElement>('.form-errors')!;

  form.setAttribute('novalidate', '');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const submission: SubmissionData = {
      name:        getInput(form, 'fullName').value.trim(),
      email:       getInput(form, 'email').value.trim(),
      dateOfBirth: getInput(form, 'dateOfBirth').value,
      phone:       getInput(form, 'phone').value.trim(),
    };

    const errors = FIELD_VALIDATORS
      .map(({ inputName, getVal, validate }) => {
        const result = validate(getVal(submission));
        applyFieldState(getInput(form, inputName), getErrorEl(form, inputName), result);
        return result;
      })
      .filter((r): r is string => r !== true);

    showSummary(errorBox, errors);

    if (errors.length > 0) return;

    FIELD_VALIDATORS.forEach(({ inputName }) => {
      getInput(form, inputName).removeAttribute('aria-invalid');
      getErrorEl(form, inputName).textContent = '';
    });

    onSubmit(submission);
    form.reset();
  });
}
