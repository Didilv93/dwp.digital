import './App/style.sass';
import { initForm } from './components/Form/index';
import { initSubmissionList } from './components/SubmissionList/index';

const form = document.querySelector<HTMLFormElement>('#contact-form');
const list = document.querySelector<HTMLUListElement>('#submission-list');

if (form && list) {
  const { addSubmission } = initSubmissionList(list);
  initForm(form, addSubmission);
}
