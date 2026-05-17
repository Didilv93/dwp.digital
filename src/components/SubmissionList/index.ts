import './style.sass';
import listHTML from './index.html?raw';
import type { SubmissionData } from '../Form/index';

const DATA_FIELDS: Array<keyof SubmissionData> = ['name', 'email', 'dateOfBirth', 'phone'];

function buildItem(data: SubmissionData, template: HTMLTemplateElement): HTMLLIElement {
  const item = (template.content.cloneNode(true) as DocumentFragment).querySelector('li')!;

  DATA_FIELDS.forEach((field) => {
    item.querySelector<HTMLElement>(`[data-field="${field}"]`)!.textContent = data[field];
  });

  const btn = item.querySelector<HTMLButtonElement>('button')!;
  btn.setAttribute('aria-label', `Remove submission for ${data.name}`);
  btn.addEventListener('click', () => item.remove());

  return item;
}

export function initSubmissionList(mount: HTMLElement): {
  addSubmission: (data: SubmissionData) => void;
} {
  mount.innerHTML = listHTML;
  const list = mount.querySelector<HTMLUListElement>('#submission-list')!;
  const template = mount.querySelector<HTMLTemplateElement>('#submission-item-template')!;

  return {
    addSubmission: (data) => list.appendChild(buildItem(data, template)),
  };
}
