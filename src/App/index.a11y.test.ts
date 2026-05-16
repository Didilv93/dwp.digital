import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { axe } from 'vitest-axe';
import { App } from './index';

const VALID = {
  fullName: 'Alice Smith',
  email: 'alice@example.com',
  dateOfBirth: '1985-01-01',
  phone: '+44 7000 000 000',
};

function setInput(root: HTMLElement, name: string, value: string): void {
  const input = root.querySelector<HTMLInputElement>(`input[name="${name}"]`);
  if (!input) throw new Error(`input[name="${name}"] not found`);
  input.value = value;
}

function fillValid(root: HTMLElement): void {
  Object.entries(VALID).forEach(([name, value]) => setInput(root, name, value));
}

function submitForm(root: HTMLElement): void {
  root
    .querySelector('form')!
    .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
}

function fillAndSubmit(root: HTMLElement): void {
  fillValid(root);
  submitForm(root);
}

describe('App – Accessibility', () => {
  let app: HTMLElement;

  beforeEach(() => {
    app = App();
    document.body.appendChild(app);
  });

  afterEach(() => {
    document.body.removeChild(app);
  });

  describe('axe automated scans', () => {
    it('has no violations on initial render', async () => {
      expect(await axe(app)).toHaveNoViolations();
    });

    it('has no violations after a valid form submission', async () => {
      fillAndSubmit(app);
      expect(await axe(app)).toHaveNoViolations();
    });

    it('has no violations after multiple submissions', async () => {
      fillAndSubmit(app);
      fillAndSubmit(app);
      expect(await axe(app)).toHaveNoViolations();
    });

    it('has no violations after adding then removing a submission', async () => {
      fillAndSubmit(app);
      app.querySelector<HTMLButtonElement>('.remove-button')?.click();
      expect(await axe(app)).toHaveNoViolations();
    });

    it('has no violations when validation errors are shown', async () => {
      submitForm(app);
      expect(await axe(app)).toHaveNoViolations();
    });
  });

  describe('heading hierarchy', () => {
    it('has exactly one <h1>', () => {
      expect(app.querySelectorAll('h1')).toHaveLength(1);
    });

    it('h1 has meaningful text', () => {
      expect(app.querySelector('h1')?.textContent?.trim()).toBeTruthy();
    });

    it('h1 appears before h2 in DOM order', () => {
      const headings = [...app.querySelectorAll('h1, h2')];
      expect(headings[0].tagName.toLowerCase()).toBe('h1');
    });

    it('h2 follows h1 (no heading levels are skipped)', () => {
      const headings = [...app.querySelectorAll('h1, h2')];
      expect(headings[1]?.tagName.toLowerCase()).toBe('h2');
    });

    it('no h3 or deeper headings exist without a preceding h2', () => {
      const h3Plus = app.querySelectorAll('h3, h4, h5, h6');
      const h2 = app.querySelector('h2');
      if (h3Plus.length > 0) {
        expect(h2).not.toBeNull();
      }
    });
  });

  describe('landmark regions', () => {
    it('app root is a <main> element', () => {
      expect(app.tagName.toLowerCase()).toBe('main');
    });

    it('submission list section has an accessible name', () => {
      const section = app.querySelector('section');
      expect(section?.getAttribute('aria-labelledby')).toBeTruthy();
    });

    it('section aria-labelledby references an existing element', () => {
      const section = app.querySelector('section');
      const labelId = section?.getAttribute('aria-labelledby');
      expect(app.querySelector(`#${labelId}`)).not.toBeNull();
    });
  });

  describe('integration: submit and remove flow', () => {
    it('a new list item appears after a valid submission', () => {
      fillAndSubmit(app);
      expect(app.querySelectorAll('.submission-item')).toHaveLength(1);
    });

    it('submitted item contains the entered name', () => {
      fillAndSubmit(app);
      expect(app.querySelector('.submission-item')?.textContent).toContain('Alice Smith');
    });

    it('form resets after a valid submission', () => {
      fillAndSubmit(app);
      expect(app.querySelector<HTMLInputElement>('input[name="fullName"]')?.value).toBe('');
    });

    it('clicking "Remove" deletes the item from the list', () => {
      fillAndSubmit(app);
      app.querySelector<HTMLButtonElement>('.remove-button')?.click();
      expect(app.querySelectorAll('.submission-item')).toHaveLength(0);
    });

    it('remove button label references the submitted name', () => {
      fillAndSubmit(app);
      const btn = app.querySelector<HTMLButtonElement>('.remove-button');
      const label = btn?.getAttribute('aria-label') ?? btn?.textContent?.trim() ?? '';
      expect(label.toLowerCase()).toContain('alice smith');
    });

    it('two submissions produce two list items each with a unique remove label', () => {
      fillAndSubmit(app);
      setInput(app, 'fullName', 'Bob Jones');
      setInput(app, 'email', 'bob@example.com');
      setInput(app, 'dateOfBirth', '1990-07-15');
      setInput(app, 'phone', '+44 7900 000 002');
      submitForm(app);

      const buttons = [...app.querySelectorAll<HTMLButtonElement>('.remove-button')];
      expect(buttons).toHaveLength(2);
      const labels = buttons.map((b) => b.getAttribute('aria-label') ?? b.textContent?.trim());
      expect(new Set(labels).size).toBe(2);
    });
  });
});
