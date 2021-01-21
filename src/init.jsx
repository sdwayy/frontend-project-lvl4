import cookies from 'js-cookie';
import faker from 'faker';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Rollbar from 'rollbar';

import userContext from './context';
import rootReducer from './slices/index';
import App from './components/App';
import { addMessage } from './slices/messages';
import { createChannel, removeChannel, renameChannel } from './slices/channels';

export default function init(initialState, socketClient) {
  if (!cookies.get('userName')) {
    cookies.set('userName', `${faker.internet.userName()}`);
  }

  const rollbar = new Rollbar({
    accessToken: initialState.rollbarToken,
    captureUncaught: true,
    captureUnhandledRejections: true,
  });

  rollbar.info('Rollbar is working');

  const store = configureStore({
    reducer: rootReducer,
    preloadedState: {
      channelsInfo: {
        channels: initialState.channels,
        currentChannelId: initialState.currentChannelId,
      },
      messagesInfo: {
        messages: initialState.messages,
      },
    },
  });

  socketClient.on('newMessage', (data) => store.dispatch(addMessage(data)));
  socketClient.on('newChannel', (data) => store.dispatch(createChannel(data)));
  socketClient.on('removeChannel', (data) => store.dispatch(removeChannel(data)));
  socketClient.on('renameChannel', (data) => store.dispatch(renameChannel(data)));

  render(
    <Provider store={store}>
      <userContext.Provider value={cookies.get('userName')}>
        <App />
      </userContext.Provider>
    </Provider>,
    document.querySelector('.container'),
  );
}
