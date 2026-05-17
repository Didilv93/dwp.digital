import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { initSubmissionList } from '../index';

describe('SubmissionList', () => {
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

  it('adds a submission to the list', () => {
    addSubmission({
      name: 'Diego Silva',
      email: 'diego@example.com',
      dateOfBirth: '1990-05-13',
      phone: '+44 7123 456 789',
    });

    expect(wrapper.querySelectorAll('li')).toHaveLength(1);
    expect(wrapper.textContent).toContain('Diego Silva');
  });

  it('removes a submission when the remove button is clicked', () => {
    addSubmission({
      name: 'Diego Silva',
      email: 'diego@example.com',
      dateOfBirth: '1990-05-13',
      phone: '+44 7123 456 789',
    });

    const removeButton = wrapper.querySelector('button');
    expect(removeButton).toBeInstanceOf(HTMLButtonElement);

    removeButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(wrapper.querySelectorAll('li')).toHaveLength(0);
  });
});
