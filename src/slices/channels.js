/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { remove } from 'lodash';

const DEFAULT_ACTIVE_CHANNEL_ID = 1;

const channelsSlice = createSlice({
  name: 'channelsInfo',
  initialState: {
    channels: [],
    currentChannelId: DEFAULT_ACTIVE_CHANNEL_ID,
  },
  reducers: {
    createChannel: (state, { payload }) => {
      const { attributes } = payload.data;
      state.channels.push(attributes);
    },

    swapChannel: (state, { payload }) => {
      state.currentChannelId = payload.id;
    },

    removeChannel: (state, { payload }) => {
      const { id } = payload.data;
      remove(state.channels, (channel) => channel.id === id);

      if (state.currentChannelId === id) {
        state.currentChannelId = DEFAULT_ACTIVE_CHANNEL_ID;
      }
    },

    renameChannel: (state, { payload }) => {
      const { name, id } = payload.data.attributes;
      const modifiedChannel = state
        .channels
        .find((channel) => channel.id === id);

      modifiedChannel.name = name;
    },
  },
});

export const {
  createChannel,
  removeChannel,
  swapChannel,
  renameChannel,
} = channelsSlice.actions;
export default channelsSlice.reducer;
