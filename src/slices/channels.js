/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const DEFAULT_ACTIVE_CHANNEL_NAME = 'general';

const channelsSlice = createSlice({
  name: 'channelsInfo',
  initialState: {
    channels: [],
    currentChannelId: 1,
  },
  reducers: {
    newChannel: (state, { payload }) => {
      const { attributes } = payload.data;
      state.channels.push(attributes);
      state.currentChannelId = attributes.id;
    },

    swapChannel: (state, { payload }) => {
      state.currentChannelId = payload;
    },

    removeChannel: (state, { payload }) => {
      const { id } = payload.data;
      state.channels = state.channels.filter((channel) => channel.id !== id);
      state.currentChannelId = state
        .channels
        .find((channel) => channel.name === DEFAULT_ACTIVE_CHANNEL_NAME)
        .id;
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
  newChannel,
  removeChannel,
  swapChannel,
  renameChannel,
} = channelsSlice.actions;
export default channelsSlice.reducer;
