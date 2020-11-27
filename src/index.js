import 'core-js/stable';
import 'regenerator-runtime/runtime';
import '../assets/application.scss';
// import faker from 'faker';
import gon from 'gon';
// import cookies from 'js-cookie';
// import io from 'socket.io-client';
import React from 'react';
import { render } from 'react-dom';
import App from './modules/App.jsx';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

console.log('it works!');
console.log('gon', gon)

render(
  <App />,
  document.querySelector('.container')
);