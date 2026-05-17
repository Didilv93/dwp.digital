import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { axe } from 'vitest-axe';
import { initForm } from '../index';
import { FORM_HTML } from '../../../test-setup/fixtures';

function setInput(root: HTMLElement, name: string, value: string): void {
  const input = root.querySelector<HTMLInputElement>(`input[name="${name}"]`);
  if (!input) throw new Error(`input[name="${name}"] not found`);
  input.value = value;
}

function submitForm(root: HTMLElement): void {
  root
    .querySelector('form')!
    .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
}

const VALID = {
  fullName: 'Name Example',
  email: 'email@example.com',
  dateOfBirth: '1990-05-13',
  phone: '+44 7123 456 789',
};

function fillValid(root: HTMLElement): void {
  Object.entries(VALID).forEach(([name, value]) => setInput(root, name, value));
}

describe('Form – Accessibility', () => {
  let wrapper: HTMLElement;

  beforeEach(() => {
    wrapper = document.createElement('div');
    wrapper.innerHTML = FORM_HTML;
    document.body.appendChild(wrapper);
    initForm(wrapper.querySelector('form')!, () => {});
  });

  afterEach(() => {
    document.body.removeChild(wrapper);
  });

  describe('axe automated scans', () => {
    it('has no violations in the default (empty) state', async () => {
      expect(await axe(wrapper)).toHaveNoViolations();
    });

    it('has no violations when validation errors are displayed', async () => {
      submitForm(wrapper);
      expect(await axe(wrapper)).toHaveNoViolations();
    });

    it('has no violations after a successful submission', async () => {
      fillValid(wrapper);
      submitForm(wrapper);
      expect(await axe(wrapper)).toHaveNoViolations();
    });
  });

  describe('label associations', () => {
    it('every input has an associated <label>', () => {
      wrapper.querySelectorAll('input').forEach((input) => {
        const label = wrapper.querySelector<HTMLLabelElement>(`label[for="${input.id}"]`);
        expect(label, `label for input#${input.id}`).not.toBeNull();
      });
    });

    it('no label has empty text', () => {
      wrapper.querySelectorAll('label').forEach((label) => {
        expect(label.textContent?.trim()).not.toBe('');
      });
    });

    it('label for attribute matches the input id', () => {
      wrapper.querySelectorAll('input').forEach((input) => {
        const label = wrapper.querySelector<HTMLLabelElement>(`label[for="${input.id}"]`);
        expect(label?.htmlFor).toBe(input.id);
      });
    });
  });

  describe('aria-describedby — field error association', () => {
    it('every input has aria-describedby pointing to an existing element', () => {
      wrapper.querySelectorAll<HTMLInputElement>('input').forEach((input) => {
        const id = input.getAttribute('aria-describedby');
        expect(id, `aria-describedby on input#${input.id}`).toBeTruthy();
        expect(wrapper.querySelector(`#${id}`)).not.toBeNull();
      });
    });

    it('each field error id follows pattern error-{inputName}', () => {
      wrapper.querySelectorAll<HTMLInputElement>('input').forEach((input) => {
        expect(wrapper.querySelector(`#error-${input.name}`)).not.toBeNull();
      });
    });
  });

  describe('autocomplete — WCAG 1.3.5', () => {
    it('name field has autocomplete="name"', () => {
      expect(wrapper.querySelector('input[name="fullName"]')?.getAttribute('autocomplete')).toBe('name');
    });

    it('email field has autocomplete="email"', () => {
      expect(wrapper.querySelector('input[name="email"]')?.getAttribute('autocomplete')).toBe('email');
    });

    it('date of birth field has autocomplete="bday"', () => {
      expect(wrapper.querySelector('input[name="dateOfBirth"]')?.getAttribute('autocomplete')).toBe('bday');
    });

    it('phone field has autocomplete="tel"', () => {
      expect(wrapper.querySelector('input[name="phone"]')?.getAttribute('autocomplete')).toBe('tel');
    });
  });

  describe('aria-invalid — field error state', () => {
    it('inputs have no aria-invalid before first submit', () => {
      wrapper.querySelectorAll<HTMLInputElement>('input').forEach((input) => {
        expect(input.getAttribute('aria-invalid')).toBeNull();
      });
    });

    it('all fields have aria-invalid="true" after an empty submit', () => {
      submitForm(wrapper);
      ['fullName', 'email', 'dateOfBirth', 'phone'].forEach((name) => {
        const input = wrapper.querySelector<HTMLInputElement>(`input[name="${name}"]`);
        expect(input?.getAttribute('aria-invalid'), name).toBe('true');
      });
    });

    it('valid fields get aria-invalid="false" on partial submit', () => {
      setInput(wrapper, 'fullName', 'Name Example');
      setInput(wrapper, 'email', 'email@example.com');
      submitForm(wrapper);
      expect(wrapper.querySelector<HTMLInputElement>('input[name="fullName"]')?.getAttribute('aria-invalid')).toBe('false');
      expect(wrapper.querySelector<HTMLInputElement>('input[name="email"]')?.getAttribute('aria-invalid')).toBe('false');
      expect(wrapper.querySelector<HTMLInputElement>('input[name="dateOfBirth"]')?.getAttribute('aria-invalid')).toBe('true');
      expect(wrapper.querySelector<HTMLInputElement>('input[name="phone"]')?.getAttribute('aria-invalid')).toBe('true');
    });

    it('aria-invalid is removed from all fields after a successful submit', () => {
      fillValid(wrapper);
      submitForm(wrapper);
      wrapper.querySelectorAll<HTMLInputElement>('input').forEach((input) => {
        expect(input.getAttribute('aria-invalid'), input.name).toBeNull();
      });
    });
  });

  describe('inline field error messages', () => {
    it('field error elements are empty before first submit', () => {
      wrapper.querySelectorAll<HTMLInputElement>('input').forEach((input) => {
        expect(wrapper.querySelector(`#error-${input.name}`)?.textContent).toBe('');
      });
    });

    it('shows inline error text for each invalid field', () => {
      submitForm(wrapper);
      expect(wrapper.querySelector('#error-fullName')?.textContent).toContain('Please enter your name');
      expect(wrapper.querySelector('#error-email')?.textContent).toContain('Please enter your email');
      expect(wrapper.querySelector('#error-dateOfBirth')?.textContent).toContain('Please enter your date of birth');
      expect(wrapper.querySelector('#error-phone')?.textContent).toContain('Please enter your phone number');
    });

    it('clears inline error for a field that becomes valid on re-submit', () => {
      submitForm(wrapper);
      setInput(wrapper, 'fullName', 'Name Example');
      submitForm(wrapper);
      expect(wrapper.querySelector('#error-fullName')?.textContent).toBe('');
    });

    it('clears all inline errors after a successful submit', () => {
      submitForm(wrapper);
      fillValid(wrapper);
      submitForm(wrapper);
      wrapper.querySelectorAll<HTMLInputElement>('input').forEach((input) => {
        expect(wrapper.querySelector(`#error-${input.name}`)?.textContent).toBe('');
      });
    });
  });

  describe('error summary focus management', () => {
    it('error summary has tabindex="-1"', () => {
      expect(wrapper.querySelector('.form-errors')?.getAttribute('tabindex')).toBe('-1');
    });

    it('error summary receives focus after a failed submit', () => {
      submitForm(wrapper);
      expect(document.activeElement).toBe(wrapper.querySelector('.form-errors'));
    });

    it('error summary has aria-live="polite"', () => {
      expect(wrapper.querySelector('.form-errors')?.getAttribute('aria-live')).toBe('polite');
    });
  });

  describe('live region (error / success feedback)', () => {
    it('announces all validation errors on an empty submit', () => {
      submitForm(wrapper);
      const text = wrapper.querySelector('.form-errors')?.textContent ?? '';
      expect(text).toContain('Please enter your name');
      expect(text).toContain('Please enter your email');
      expect(text).toContain('Please enter your date of birth');
      expect(text).toContain('Please enter your phone number');
    });

    it('announces success message after a valid submit', () => {
      fillValid(wrapper);
      submitForm(wrapper);
      expect(wrapper.querySelector('.form-errors')?.textContent).toContain('Valid data. Submission has been added.');
    });

    it('renders multiple errors in a <ul>', () => {
      submitForm(wrapper);
      expect(wrapper.querySelector('.form-errors ul')).toBeInstanceOf(HTMLUListElement);
    });

    it('each error is a <li>', () => {
      submitForm(wrapper);
      wrapper.querySelectorAll('.form-errors li').forEach((li) => {
        expect(li.tagName.toLowerCase()).toBe('li');
      });
    });

    it('error count decreases when fields are fixed on re-submit', () => {
      submitForm(wrapper);
      const firstCount = wrapper.querySelectorAll('.form-errors li').length;
      setInput(wrapper, 'fullName', 'Name Example');
      submitForm(wrapper);
      expect(wrapper.querySelectorAll('.form-errors li').length).toBeLessThan(firstCount);
    });
  });

  describe('input types', () => {
    it('email field uses type="email"', () => {
      expect(wrapper.querySelector('input[name="email"]')?.getAttribute('type')).toBe('email');
    });

    it('date of birth field uses type="date"', () => {
      expect(wrapper.querySelector('input[name="dateOfBirth"]')?.getAttribute('type')).toBe('date');
    });

    it('phone field uses type="tel"', () => {
      expect(wrapper.querySelector('input[name="phone"]')?.getAttribute('type')).toBe('tel');
    });

    it('name field uses type="text"', () => {
      expect(wrapper.querySelector('input[name="fullName"]')?.getAttribute('type')).toBe('text');
    });
  });

  describe('keyboard accessibility', () => {
    it('all inputs are naturally focusable', () => {
      wrapper.querySelectorAll<HTMLInputElement>('input').forEach((input) => {
        expect(input.tabIndex).toBeGreaterThanOrEqual(0);
      });
    });

    it('submit button is naturally focusable', () => {
      expect(wrapper.querySelector<HTMLButtonElement>('button[type="submit"]')?.tabIndex).toBeGreaterThanOrEqual(0);
    });

    it('DOM tab order: name → email → dob → phone → submit', () => {
      const els = [...wrapper.querySelectorAll('input, button[type="submit"]')];
      const ids = els.map((el) => (el as HTMLInputElement).name || el.tagName.toLowerCase());
      expect(ids).toEqual(['fullName', 'email', 'dateOfBirth', 'phone', 'button']);
    });

    it('submit button has a discernible accessible name', () => {
      const btn = wrapper.querySelector<HTMLButtonElement>('button[type="submit"]');
      const name = btn?.getAttribute('aria-label') ?? btn?.getAttribute('aria-labelledby') ?? btn?.textContent?.trim();
      expect(name).toBeTruthy();
    });
  });

  describe('semantic HTML', () => {
    it('wraps fields in a <form>', () => {
      expect(wrapper.querySelector('form')).toBeInstanceOf(HTMLFormElement);
    });

    it('uses noValidate', () => {
      expect(wrapper.querySelector('form')?.noValidate).toBe(true);
    });

    it('submit control is a <button type="submit">', () => {
      const btn = wrapper.querySelector<HTMLButtonElement>('button[type="submit"]');
      expect(btn).toBeInstanceOf(HTMLButtonElement);
      expect(btn?.type).toBe('submit');
    });

    it('form has four input fields', () => {
      expect(wrapper.querySelectorAll('input')).toHaveLength(4);
    });
  });
});
