import 'core-js/stable';
import 'regenerator-runtime/runtime';
import '../assets/application.scss';
import init from './init';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

init();
