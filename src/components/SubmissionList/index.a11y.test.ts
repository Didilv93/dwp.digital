import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { axe } from 'vitest-axe';
import { createSubmissionList } from './index';
import type { SubmissionData } from '../Form/index';

const ALICE: SubmissionData = {
  name: 'Alice Smith',
  email: 'alice@example.com',
  dateOfBirth: '1985-03-20',
  phone: '+44 7900 000 001',
};

const BOB: SubmissionData = {
  name: 'Bob Jones',
  email: 'bob@example.com',
  dateOfBirth: '1990-07-15',
  phone: '+44 7900 000 002',
};

describe('SubmissionList – Accessibility', () => {
  let wrapper: HTMLElement;
  let component: ReturnType<typeof createSubmissionList>;

  beforeEach(() => {
    wrapper = document.createElement('div');
    document.body.appendChild(wrapper);
    component = createSubmissionList();
    wrapper.appendChild(component.element);
  });

  afterEach(() => {
    document.body.removeChild(wrapper);
  });

  describe('axe automated scans', () => {
    it('has no violations when empty', async () => {
      expect(await axe(wrapper)).toHaveNoViolations();
    });

    it('has no violations with one submission', async () => {
      component.addSubmission(ALICE);
      expect(await axe(wrapper)).toHaveNoViolations();
    });

    it('has no violations with multiple submissions', async () => {
      component.addSubmission(ALICE);
      component.addSubmission(BOB);
      expect(await axe(wrapper)).toHaveNoViolations();
    });

    it('has no violations after a submission is removed', async () => {
      component.addSubmission(ALICE);
      component.element.querySelector<HTMLButtonElement>('button')?.click();
      expect(await axe(wrapper)).toHaveNoViolations();
    });
  });

  describe('landmark and structure', () => {
    it('root element is a <section>', () => {
      expect(component.element.tagName.toLowerCase()).toBe('section');
    });

    it('section has aria-labelledby pointing to a non-empty element', () => {
      const labelId = component.element.getAttribute('aria-labelledby');
      expect(labelId).toBeTruthy();
      const labelEl = wrapper.querySelector(`#${labelId}`);
      expect(labelEl?.textContent?.trim()).toBeTruthy();
    });

    it('h2 id matches the section aria-labelledby value', () => {
      const labelId = component.element.getAttribute('aria-labelledby');
      const h2 = component.element.querySelector('h2');
      expect(h2?.id).toBe(labelId);
    });

    it('has a visible <h2> heading', () => {
      expect(component.element.querySelector('h2')?.textContent?.trim()).toBeTruthy();
    });

    it('uses a <ul> for the list of submissions', () => {
      expect(component.element.querySelector('ul')).toBeInstanceOf(HTMLUListElement);
    });
  });

  describe('submission items', () => {
    it('each submission renders as a <li>', () => {
      component.addSubmission(ALICE);
      component.addSubmission(BOB);
      expect(component.element.querySelectorAll('li')).toHaveLength(2);
    });

    it('item displays the submitter name', () => {
      component.addSubmission(ALICE);
      expect(component.element.querySelector('li')?.textContent).toContain('Alice Smith');
    });

    it('item displays the submitter email', () => {
      component.addSubmission(ALICE);
      expect(component.element.querySelector('li')?.textContent).toContain('alice@example.com');
    });

    it('item displays the date of birth', () => {
      component.addSubmission(ALICE);
      expect(component.element.querySelector('li')?.textContent).toContain('1985-03-20');
    });

    it('item displays the phone number', () => {
      component.addSubmission(ALICE);
      expect(component.element.querySelector('li')?.textContent).toContain('+44 7900 000 001');
    });
  });

  describe('remove buttons', () => {
    it('remove button aria-label includes the submitter name', () => {
      component.addSubmission(ALICE);
      const btn = component.element.querySelector<HTMLButtonElement>('button');
      const label = btn?.getAttribute('aria-label') ?? btn?.textContent?.trim() ?? '';
      expect(label.toLowerCase()).toContain('alice smith');
    });

    it('each remove button has a unique accessible label when multiple items exist', () => {
      component.addSubmission(ALICE);
      component.addSubmission(BOB);
      const buttons = [...component.element.querySelectorAll<HTMLButtonElement>('button')];
      const labels = buttons.map((b) => b.getAttribute('aria-label') ?? b.textContent?.trim());
      expect(new Set(labels).size).toBe(buttons.length);
    });

    it('has type="button" to prevent accidental form submission', () => {
      component.addSubmission(ALICE);
      const btn = component.element.querySelector<HTMLButtonElement>('button');
      expect(btn?.type).toBe('button');
    });

    it('is naturally focusable (tabIndex >= 0)', () => {
      component.addSubmission(ALICE);
      const btn = component.element.querySelector<HTMLButtonElement>('button');
      expect(btn?.tabIndex).toBeGreaterThanOrEqual(0);
    });

    it('clicking removes the item from the list', () => {
      component.addSubmission(ALICE);
      component.element.querySelector<HTMLButtonElement>('button')?.click();
      expect(component.element.querySelectorAll('li')).toHaveLength(0);
    });

    it('only the targeted item is removed when multiple exist', () => {
      component.addSubmission(ALICE);
      component.addSubmission(BOB);
      component.element.querySelector<HTMLButtonElement>('button')?.click();
      expect(component.element.querySelectorAll('li')).toHaveLength(1);
      expect(component.element.querySelector('li')?.textContent).toContain('Bob Jones');
    });
  });
});
