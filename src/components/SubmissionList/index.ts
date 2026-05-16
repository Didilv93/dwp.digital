import './style.sass';
import type { SubmissionData } from '../Form/index';

interface SubmissionListComponent {
  element: HTMLElement;
  addSubmission: (data: SubmissionData) => void;
}

export function createSubmissionList(): SubmissionListComponent {
  const container = document.createElement('section');
  container.className = 'submission-list-shell';

  const title = document.createElement('h2');
  title.id = 'submission-list-title';
  title.textContent = 'Recent submissions';

  const list = document.createElement('ul');
  list.className = 'submission-list';

  container.setAttribute('aria-labelledby', 'submission-list-title');
  container.append(title, list);

  function createItem(data: SubmissionData) {
    const item = document.createElement('li');
    item.className = 'submission-item';

    const summary = document.createElement('div');
    summary.className = 'submission-info';

    const nameEl = document.createElement('strong');
    nameEl.textContent = data.name;

    const emailEl = document.createElement('span');
    emailEl.textContent = data.email;

    const dobEl = document.createElement('span');
    dobEl.textContent = data.dateOfBirth;

    const phoneEl = document.createElement('span');
    phoneEl.textContent = data.phone;

    summary.append(nameEl, emailEl, dobEl, phoneEl);

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'remove-button';
    removeButton.textContent = 'Remove';
    removeButton.setAttribute('aria-label', `Remove submission for ${data.name}`);
    removeButton.addEventListener('click', () => item.remove());

    item.append(summary, removeButton);
    return item;
  }

  function addSubmission(data: SubmissionData) {
    list.appendChild(createItem(data));
  }

  return { element: container, addSubmission };
}
