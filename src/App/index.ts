import { createForm, SubmissionData } from '../components/Form/index';
import { createSubmissionList } from '../components/SubmissionList/index';

export function App() {
  const container = document.createElement('main');
  container.className = 'app-shell';

  const heading = document.createElement('h1');
  heading.textContent = 'Contact Form';

  const description = document.createElement('p');
  description.textContent = 'Enter your details below and see saved submissions on this page.';

  const submissionList = createSubmissionList();
  const form = createForm((data: SubmissionData) => submissionList.addSubmission(data));

  container.append(heading, description, form.element, submissionList.element);
  return container;
}
