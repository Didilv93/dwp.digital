import './style.sass';
import type { SubmissionData } from '../Form/index';

const DATA_FIELDS: Array<keyof SubmissionData> = ['name', 'email', 'dateOfBirth', 'phone'];

function buildItem(data: SubmissionData): HTMLLIElement {
  const template = document.getElementById('submission-item-template') as HTMLTemplateElement | null;

  let item: HTMLLIElement;

  if (template) {
    item = (template.content.cloneNode(true) as DocumentFragment).querySelector('li')!;
  } else {
    item = document.createElement('li');
    item.className = 'submission-item';
    item.innerHTML = `
      <div class="submission-info">
        <strong data-field="name"></strong>
        <span data-field="email"></span>
        <span data-field="dateOfBirth"></span>
        <span data-field="phone"></span>
      </div>
      <button type="button" class="remove-button">Remove</button>`;
  }

  DATA_FIELDS.forEach((field) => {
    item.querySelector<HTMLElement>(`[data-field="${field}"]`)!.textContent = data[field];
  });

  const btn = item.querySelector<HTMLButtonElement>('button')!;
  btn.setAttribute('aria-label', `Remove submission for ${data.name}`);
  btn.addEventListener('click', () => item.remove());

  return item;
}

export function initSubmissionList(list: HTMLUListElement): {
  addSubmission: (data: SubmissionData) => void;
} {
  return {
    addSubmission: (data) => list.appendChild(buildItem(data)),
  };
}
