import 'core-js/stable';
import 'regenerator-runtime/runtime';
import '../assets/application.scss';
import faker from 'faker';
import gon from 'gon';
import cookies from 'js-cookie';
import io from 'socket.io-client';

import React from 'react';
import userContext from './context';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import App from './components/App';
import rootReducer from './slices/index';
import { addMessage } from './slices/messages';

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
    messages: gon.messages
  },
};

const store = configureStore({ 
  reducer: rootReducer,
  preloadedState: initialState,
});

const socket = io();
socket.on('newMessage', () => store.dispatch(addMessage));

render(
  <Provider store={store}>
    <userContext.Provider value={cookies.get('userName')}>
      <App />
    </userContext.Provider>
  </Provider>,
  document.querySelector('.container')
);
