import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initSubmissionList } from '../index';
import type { SubmissionData } from '../../Form/index';
import { LIST_HTML } from '../../../test-setup/fixtures';

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

describe('SubmissionList', () => {
  let wrapper: HTMLElement;
  let addSubmission: ReturnType<typeof initSubmissionList>['addSubmission'];

  beforeEach(() => {
    wrapper = document.createElement('div');
    wrapper.innerHTML = LIST_HTML;
    document.body.appendChild(wrapper);
    ({ addSubmission } = initSubmissionList(wrapper));
  });

  afterEach(() => {
    document.body.removeChild(wrapper);
    vi.useRealTimers();
  });

  it('adds a submission to the list', () => {
    addSubmission(ALICE);
    expect(wrapper.querySelectorAll('li')).toHaveLength(1);
    expect(wrapper.textContent).toContain('Alice Smith');
  });

  it('removes a submission when the remove button is clicked', () => {
    addSubmission(ALICE);
    const removeButton = wrapper.querySelector('button');
    expect(removeButton).toBeInstanceOf(HTMLButtonElement);
    removeButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(wrapper.querySelectorAll('li')).toHaveLength(0);
  });

  describe('empty state', () => {
    let emptyState: HTMLElement;

    beforeEach(() => {
      emptyState = wrapper.querySelector<HTMLElement>('.empty-state')!;
    });

    it('is visible on initial render', () => {
      expect(emptyState.hidden).toBe(false);
    });

    it('is hidden after the first submission is added', () => {
      addSubmission(ALICE);
      expect(emptyState.hidden).toBe(true);
    });

    it('remains hidden with multiple submissions', () => {
      addSubmission(ALICE);
      addSubmission(BOB);
      expect(emptyState.hidden).toBe(true);
    });

    it('becomes visible after the last submission is removed', () => {
      addSubmission(ALICE);
      wrapper.querySelector<HTMLButtonElement>('button')?.click();
      expect(emptyState.hidden).toBe(false);
    });

    it('stays hidden when one submission remains after removing another', () => {
      addSubmission(ALICE);
      addSubmission(BOB);
      wrapper.querySelector<HTMLButtonElement>('button')?.click();
      expect(emptyState.hidden).toBe(true);
    });

    it('receives focus when the last submission is removed', () => {
      addSubmission(ALICE);
      wrapper.querySelector<HTMLButtonElement>('button')?.click();
      expect(document.activeElement).toBe(emptyState);
    });

    it('does not receive focus when items remain after removal', () => {
      addSubmission(ALICE);
      addSubmission(BOB);
      wrapper.querySelector<HTMLButtonElement>('button')?.click();
      expect(document.activeElement).not.toBe(emptyState);
    });

    it('status region announces the removed name when the last item is removed', () => {
      vi.useFakeTimers();
      addSubmission(ALICE);
      wrapper.querySelector<HTMLButtonElement>('button')?.click();
      vi.runAllTimers();
      expect(wrapper.querySelector('.list-status')?.textContent).toContain('Alice Smith');
    });

    it('status region announces the removed name when items remain', () => {
      vi.useFakeTimers();
      addSubmission(ALICE);
      addSubmission(BOB);
      wrapper.querySelector<HTMLButtonElement>('button')?.click();
      vi.runAllTimers();
      expect(wrapper.querySelector('.list-status')?.textContent).toContain('Alice Smith');
    });

    it('has meaningful text content', () => {
      expect(emptyState.textContent?.trim()).toBeTruthy();
    });
  });
});
