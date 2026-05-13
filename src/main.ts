import './App/style.sass';
import { App } from './App/index';

const root = document.getElementById('app');
if (root) {
  root.appendChild(App());
}
