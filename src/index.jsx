import 'core-js/stable';
import 'regenerator-runtime/runtime';
import '../assets/application.scss';
import faker from 'faker';
import gon from 'gon';
import cookies from 'js-cookie';
import io from 'socket.io-client';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userContext from './context';

import App from './components/App';
import rootReducer from './slices/index';
import { addMessage } from './slices/messages';
import { newChannel, removeChannel, renameChannel } from './slices/channels';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

if (!cookies.get('userName')) {
  cookies.set('userName', `${faker.internet.userName()}`);
}

console.log('gon: ', gon);

const initialState = {
  channelsInfo: {
    channels: gon.channels,
    currentChannelId: gon.currentChannelId,
  },
  messagesInfo: {
    messages: gon.messages,
  },
};

const store = configureStore({
  reducer: rootReducer,
  preloadedState: initialState,
});

const socket = io();

socket.on('newMessage', (data) => store.dispatch(addMessage(data)));
socket.on('newChannel', (data) => store.dispatch(newChannel(data)));
socket.on('removeChannel', (data) => store.dispatch(removeChannel(data)));
socket.on('renameChannel', (data) => store.dispatch(renameChannel(data)));

render(
  <Provider store={store}>
    <userContext.Provider value={cookies.get('userName')}>
      <App />
    </userContext.Provider>
  </Provider>,
  document.querySelector('.container'),
);
