import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { initSubmissionList } from '../index';
import { LIST_HTML } from '../../../test-setup/fixtures';

describe('SubmissionList', () => {
  let wrapper: HTMLElement;
  let addSubmission: ReturnType<typeof initSubmissionList>['addSubmission'];

  beforeEach(() => {
    wrapper = document.createElement('div');
    wrapper.innerHTML = LIST_HTML;
    document.body.appendChild(wrapper);
    const list = wrapper.querySelector<HTMLUListElement>('#submission-list')!;
    ({ addSubmission } = initSubmissionList(list));
  });

  afterEach(() => {
    document.body.removeChild(wrapper);
  });

  it('adds a submission to the list', () => {
    addSubmission({
      name: 'Name Example',
      email: 'email@example.com',
      dateOfBirth: '1990-05-13',
      phone: '+44 7123 456 789',
    });

    expect(wrapper.querySelectorAll('li')).toHaveLength(1);
    expect(wrapper.textContent).toContain('Name Example');
  });

  it('removes a submission when the remove button is clicked', () => {
    addSubmission({
      name: 'Name Example',
      email: 'email@example.com',
      dateOfBirth: '1990-05-13',
      phone: '+44 7123 456 789',
    });

    const removeButton = wrapper.querySelector('button');
    expect(removeButton).toBeInstanceOf(HTMLButtonElement);

    removeButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(wrapper.querySelectorAll('li')).toHaveLength(0);
  });
});
