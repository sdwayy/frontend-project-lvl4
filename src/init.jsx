import cookies from 'js-cookie';
import faker from 'faker';
import gon from 'gon';
import io from 'socket.io-client';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Rollbar from 'rollbar';

import userContext from './context';
import rootReducer from './slices/index';
import App from './components/App';
import { addMessage } from './slices/messages';
import { newChannel, removeChannel, renameChannel } from './slices/channels';

export default function init() {
  if (!cookies.get('userName')) {
    cookies.set('userName', `${faker.internet.userName()}`);
  }

  const rollbar = new Rollbar({
    accessToken: gon.rollbarToken,
    captureUncaught: true,
    captureUnhandledRejections: true,
  });

  rollbar.info('Rollbar is working');

  const store = configureStore({
    reducer: rootReducer,
    preloadedState: {
      channelsInfo: {
        channels: gon.channels,
        currentChannelId: gon.currentChannelId,
      },
      messagesInfo: {
        messages: gon.messages,
      },
    },
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
}
