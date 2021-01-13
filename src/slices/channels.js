/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const DEFAULT_ACTIVE_CHANNEL_ID = 1;

const channelsSlice = createSlice({
  name: 'channelsInfo',
  initialState: {
    channels: [],
    currentChannelId: DEFAULT_ACTIVE_CHANNEL_ID,
  },
  reducers: {
    newChannel: (state, { payload }) => {
      const { data: { attributes } } = payload;
      state.channels.push(attributes);
      state.currentChannelId = attributes.id;
    },

    swapChannel: (state, { payload }) => {
      state.currentChannelId = payload;
    },

    removeChannel: (state, { payload }) => {
      const { data: { id } } = payload;
      state.channels = state.channels.filter((channel) => channel.id !== id);
      state.currentChannelId = DEFAULT_ACTIVE_CHANNEL_ID;
    },

    renameChannel: (state, { payload }) => {
      const { data: { attributes: { name, id } } } = payload;
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
