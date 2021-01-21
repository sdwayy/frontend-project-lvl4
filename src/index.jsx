import 'core-js/stable';
import 'regenerator-runtime/runtime';
import '../assets/application.scss';
import init from './init';
import gon from 'gon';
import io from 'socket.io-client';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

const socket = io();

init(gon, socket);
