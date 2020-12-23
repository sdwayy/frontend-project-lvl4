/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { omit } from 'lodash';
import { removeChannel } from './channels';

const messagesSlice = createSlice({
  name: 'messagesInfo',
  initialState: {
    messages: [],
  },
  reducers: {
    addMessage: (state, action) => {
      const { attributes } = action.payload.data;
      const message = omit(attributes, 'currentChannelId');
      state.messages.push(message);
    },
  },
  extraReducers: {
    [removeChannel]: (state, action) => {
      const { payload: { data: { id } } } = action;
      state.messages = state.messages.filter((message) => id !== message.channelId);
    },
  },
});

export const { addMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
