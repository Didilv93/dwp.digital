import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { axe } from 'vitest-axe';
import { initForm } from '../../components/Form/index';
import { initSubmissionList } from '../../components/SubmissionList/index';
import { PAGE_SHELL_HTML } from '../../test-setup/fixtures';

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
  fullName: 'Alice Smith',
  email: 'alice@example.com',
  dateOfBirth: '1985-01-01',
  phone: '+44 7000 000 000',
};

function fillAndSubmit(root: HTMLElement): void {
  Object.entries(VALID).forEach(([name, value]) => setInput(root, name, value));
  submitForm(root);
}

describe('App – Accessibility', () => {
  let app: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = PAGE_SHELL_HTML;
    const formMount = document.querySelector<HTMLElement>('#form-mount')!;
    const listMount = document.querySelector<HTMLElement>('#list-mount')!;
    const { addSubmission } = initSubmissionList(listMount);
    initForm(formMount, addSubmission);
    app = document.querySelector<HTMLElement>('main')!;
  });

  afterEach(() => {
    document.body.innerHTML = '';
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

    it('h2 follows h1 with no skipped levels', () => {
      const headings = [...app.querySelectorAll('h1, h2')];
      expect(headings[1]?.tagName.toLowerCase()).toBe('h2');
    });
  });

  describe('landmark regions', () => {
    it('app root is a <main> element', () => {
      expect(app.tagName.toLowerCase()).toBe('main');
    });

    it('submission list section has an accessible name', () => {
      expect(app.querySelector('section')?.getAttribute('aria-labelledby')).toBeTruthy();
    });

    it('section aria-labelledby references an existing element', () => {
      const labelId = app.querySelector('section')?.getAttribute('aria-labelledby');
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

    it('clicking Remove deletes the item', () => {
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

    it('two submissions produce two unique remove labels', () => {
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
