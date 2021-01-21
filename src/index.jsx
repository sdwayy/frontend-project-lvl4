import 'core-js/stable';
import 'regenerator-runtime/runtime';
import '../assets/application.scss';
import io from 'socket.io-client';
import gon from 'gon';
import init from './init';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

const socket = io();
init(gon, socket);
