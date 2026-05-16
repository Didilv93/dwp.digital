import { describe, it, expect, beforeEach } from 'vitest';
import { createSubmissionList } from '../index';

describe('SubmissionList', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('adds a submission to the list', () => {
    const component = createSubmissionList();
    document.body.appendChild(component.element);

    component.addSubmission({
      name: 'Diego Silva',
      email: 'diego@example.com',
      dateOfBirth: '1990-05-13',
      phone: '+44 7123 456 789',
    });

    expect(component.element.querySelectorAll('li')).toHaveLength(1);
    expect(component.element.textContent).toContain('Diego Silva');
  });

  it('removes a submission when the remove button is clicked', () => {
    const component = createSubmissionList();
    document.body.appendChild(component.element);

    component.addSubmission({
      name: 'Diego Silva',
      email: 'diego@example.com',
      dateOfBirth: '1990-05-13',
      phone: '+44 7123 456 789',
    });

    const removeButton = component.element.querySelector('button');
    expect(removeButton).toBeInstanceOf(HTMLButtonElement);

    removeButton?.dispatchEvent(new MouseEvent('click'));
    expect(component.element.querySelectorAll('li')).toHaveLength(0);
  });
});
