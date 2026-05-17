import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { axe } from 'vitest-axe';
import { initSubmissionList } from '../index';
import type { SubmissionData } from '../../Form/index';

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
  let addSubmission: ReturnType<typeof initSubmissionList>['addSubmission'];

  beforeEach(() => {
    wrapper = document.createElement('div');
    document.body.appendChild(wrapper);
    ({ addSubmission } = initSubmissionList(wrapper));
  });

  afterEach(() => {
    document.body.removeChild(wrapper);
  });

  describe('axe automated scans', () => {
    it('has no violations when empty', async () => {
      expect(await axe(wrapper)).toHaveNoViolations();
    });

    it('has no violations with one submission', async () => {
      addSubmission(ALICE);
      expect(await axe(wrapper)).toHaveNoViolations();
    });

    it('has no violations with multiple submissions', async () => {
      addSubmission(ALICE);
      addSubmission(BOB);
      expect(await axe(wrapper)).toHaveNoViolations();
    });

    it('has no violations after a submission is removed', async () => {
      addSubmission(ALICE);
      wrapper.querySelector<HTMLButtonElement>('button')?.click();
      expect(await axe(wrapper)).toHaveNoViolations();
    });
  });

  describe('landmark and structure', () => {
    it('root element is a <section>', () => {
      expect(wrapper.querySelector('section')?.tagName.toLowerCase()).toBe('section');
    });

    it('section has aria-labelledby pointing to a non-empty element', () => {
      const section = wrapper.querySelector('section')!;
      const labelId = section.getAttribute('aria-labelledby');
      expect(labelId).toBeTruthy();
      expect(wrapper.querySelector(`#${labelId}`)?.textContent?.trim()).toBeTruthy();
    });

    it('h2 id matches section aria-labelledby', () => {
      const section = wrapper.querySelector('section')!;
      const h2 = wrapper.querySelector('h2');
      expect(h2?.id).toBe(section.getAttribute('aria-labelledby'));
    });

    it('has a visible <h2> heading', () => {
      expect(wrapper.querySelector('h2')?.textContent?.trim()).toBeTruthy();
    });

    it('uses a <ul> for the list of submissions', () => {
      expect(wrapper.querySelector('ul')).toBeInstanceOf(HTMLUListElement);
    });
  });

  describe('submission items', () => {
    it('each submission renders as a <li>', () => {
      addSubmission(ALICE);
      addSubmission(BOB);
      expect(wrapper.querySelectorAll('li')).toHaveLength(2);
    });

    it('item displays the submitter name', () => {
      addSubmission(ALICE);
      expect(wrapper.querySelector('li')?.textContent).toContain('Alice Smith');
    });

    it('item displays the submitter email', () => {
      addSubmission(ALICE);
      expect(wrapper.querySelector('li')?.textContent).toContain('alice@example.com');
    });

    it('item displays the date of birth', () => {
      addSubmission(ALICE);
      expect(wrapper.querySelector('li')?.textContent).toContain('1985-03-20');
    });

    it('item displays the phone number', () => {
      addSubmission(ALICE);
      expect(wrapper.querySelector('li')?.textContent).toContain('+44 7900 000 001');
    });
  });

  describe('remove buttons', () => {
    it('aria-label includes the submitter name', () => {
      addSubmission(ALICE);
      const btn = wrapper.querySelector<HTMLButtonElement>('button');
      const label = btn?.getAttribute('aria-label') ?? btn?.textContent?.trim() ?? '';
      expect(label.toLowerCase()).toContain('alice smith');
    });

    it('each remove button has a unique label when multiple items exist', () => {
      addSubmission(ALICE);
      addSubmission(BOB);
      const buttons = [...wrapper.querySelectorAll<HTMLButtonElement>('button')];
      const labels = buttons.map((b) => b.getAttribute('aria-label') ?? b.textContent?.trim());
      expect(new Set(labels).size).toBe(buttons.length);
    });

    it('has type="button"', () => {
      addSubmission(ALICE);
      expect(wrapper.querySelector<HTMLButtonElement>('button')?.type).toBe('button');
    });

    it('is naturally focusable', () => {
      addSubmission(ALICE);
      expect(wrapper.querySelector<HTMLButtonElement>('button')?.tabIndex).toBeGreaterThanOrEqual(0);
    });

    it('clicking removes the item', () => {
      addSubmission(ALICE);
      wrapper.querySelector<HTMLButtonElement>('button')?.click();
      expect(wrapper.querySelectorAll('li')).toHaveLength(0);
    });

    it('only the targeted item is removed when multiple exist', () => {
      addSubmission(ALICE);
      addSubmission(BOB);
      wrapper.querySelector<HTMLButtonElement>('button')?.click();
      expect(wrapper.querySelectorAll('li')).toHaveLength(1);
      expect(wrapper.querySelector('li')?.textContent).toContain('Bob Jones');
    });
  });
});
