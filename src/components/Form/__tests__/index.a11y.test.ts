import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { axe } from 'vitest-axe';
import { createForm } from '../index';

const VALID = {
  fullName: 'Diego Silva',
  email: 'diego@example.com',
  dateOfBirth: '1990-05-13',
  phone: '+44 7123 456 789',
};

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

function fillValid(root: HTMLElement): void {
  Object.entries(VALID).forEach(([name, value]) => setInput(root, name, value));
}

describe('Form – Accessibility', () => {
  let wrapper: HTMLElement;

  beforeEach(() => {
    wrapper = document.createElement('div');
    document.body.appendChild(wrapper);
    wrapper.appendChild(createForm(() => {}).element);
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

  describe('live region (error / success feedback)', () => {
    it('feedback container has aria-live="polite"', () => {
      const errorBox = wrapper.querySelector('.form-errors');
      expect(errorBox?.getAttribute('aria-live')).toBe('polite');
    });

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
      const text = wrapper.querySelector('.form-errors')?.textContent ?? '';
      expect(text).toContain('Valid data. Submission has been added.');
    });

    it('renders multiple errors in a <ul>', () => {
      submitForm(wrapper);
      expect(wrapper.querySelector('.form-errors ul')).toBeInstanceOf(HTMLUListElement);
    });

    it('each error is a <li> element', () => {
      submitForm(wrapper);
      const items = wrapper.querySelectorAll('.form-errors li');
      expect(items.length).toBeGreaterThan(0);
      items.forEach((item) => expect(item.tagName.toLowerCase()).toBe('li'));
    });

    it('error list is cleared and replaced on re-submit', () => {
      submitForm(wrapper);
      const firstCount = wrapper.querySelectorAll('.form-errors li').length;

      setInput(wrapper, 'fullName', 'Diego Silva');
      submitForm(wrapper);
      const secondCount = wrapper.querySelectorAll('.form-errors li').length;

      expect(secondCount).toBeLessThan(firstCount);
    });
  });

  describe('keyboard accessibility', () => {
    it('all inputs are naturally focusable (tabIndex >= 0)', () => {
      wrapper.querySelectorAll<HTMLInputElement>('input').forEach((input) => {
        expect(input.tabIndex).toBeGreaterThanOrEqual(0);
      });
    });

    it('submit button is naturally focusable (tabIndex >= 0)', () => {
      const btn = wrapper.querySelector<HTMLButtonElement>('button[type="submit"]');
      expect(btn?.tabIndex).toBeGreaterThanOrEqual(0);
    });

    it('focusable elements appear in logical DOM order: name → email → dob → phone → submit', () => {
      const elements = [...wrapper.querySelectorAll('input, button[type="submit"]')];
      const ids = elements.map(
        (el) => (el as HTMLInputElement).name || el.tagName.toLowerCase(),
      );
      expect(ids).toEqual(['fullName', 'email', 'dateOfBirth', 'phone', 'button']);
    });

    it('submit button has a discernible accessible name', () => {
      const btn = wrapper.querySelector<HTMLButtonElement>('button[type="submit"]');
      const accessibleName =
        btn?.getAttribute('aria-label') ??
        btn?.getAttribute('aria-labelledby') ??
        btn?.textContent?.trim();
      expect(accessibleName).toBeTruthy();
    });
  });

  describe('semantic HTML', () => {
    it('wraps fields in a <form> element', () => {
      expect(wrapper.querySelector('form')).toBeInstanceOf(HTMLFormElement);
    });

    it('uses noValidate (relies on custom JS validation)', () => {
      expect(wrapper.querySelector('form')?.noValidate).toBe(true);
    });

    it('submit control is a <button> with type="submit"', () => {
      const btn = wrapper.querySelector<HTMLButtonElement>('button[type="submit"]');
      expect(btn).toBeInstanceOf(HTMLButtonElement);
      expect(btn?.type).toBe('submit');
    });

    it('form has four input fields', () => {
      expect(wrapper.querySelectorAll('input')).toHaveLength(4);
    });
  });
});
