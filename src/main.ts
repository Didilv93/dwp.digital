import './App/style.sass';
import { initForm } from './components/Form/index';
import { initSubmissionList } from './components/SubmissionList/index';

const formMount = document.querySelector<HTMLElement>('#form-mount');
const listMount = document.querySelector<HTMLElement>('#list-mount');

if (formMount && listMount) {
  const { addSubmission } = initSubmissionList(listMount);
  initForm(formMount, addSubmission);
}
