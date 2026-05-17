import './style.sass';
import listHTML from './index.html?raw';
import type { SubmissionData } from '../Form/index';

const DATA_FIELDS: Array<keyof SubmissionData> = ['name', 'email', 'dateOfBirth', 'phone'];

function buildItem(
  data: SubmissionData,
  template: HTMLTemplateElement,
  list: HTMLUListElement,
  statusEl: HTMLElement,
  listHeading: HTMLElement,
): HTMLLIElement {
  const item = (template.content.cloneNode(true) as DocumentFragment).querySelector('li')!;

  DATA_FIELDS.forEach((field) => {
    item.querySelector<HTMLElement>(`[data-field="${field}"]`)!.textContent = data[field];
  });

  const btn = item.querySelector<HTMLButtonElement>('button')!;
  btn.setAttribute('aria-label', `Remove submission for ${data.name}`);
  btn.addEventListener('click', () => {
    const buttons = [...list.querySelectorAll<HTMLButtonElement>('.remove-button')];
    const idx = buttons.indexOf(btn);

    item.remove();

    const remaining = list.querySelectorAll<HTMLButtonElement>('.remove-button');
    if (remaining.length > 0) {
      remaining[Math.min(idx, remaining.length - 1)].focus();
    } else {
      listHeading.setAttribute('tabindex', '-1');
      listHeading.focus();
    }

    statusEl.textContent = '';
    requestAnimationFrame(() => {
      statusEl.textContent = `Removed submission for ${data.name}.`;
    });
  });

  return item;
}

export function initSubmissionList(mount: HTMLElement): {
  addSubmission: (data: SubmissionData) => void;
} {
  mount.innerHTML = listHTML;
  const list = mount.querySelector<HTMLUListElement>('#submission-list')!;
  const template = mount.querySelector<HTMLTemplateElement>('#submission-item-template')!;
  const statusEl = mount.querySelector<HTMLElement>('.list-status')!;
  const listHeading = mount.querySelector<HTMLElement>('#submission-list-title')!;

  return {
    addSubmission: (data) => list.appendChild(buildItem(data, template, list, statusEl, listHeading)),
  };
}
