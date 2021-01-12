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
    newChannel: (state, action) => {
      const { payload: { data: { attributes } } } = action;
      state.channels.push(attributes);
      state.currentChannelId = attributes.id;
    },

    swapChannel: (state, action) => {
      const { payload } = action;
      state.currentChannelId = payload;
    },

    removeChannel: (state, action) => {
      const { payload: { data: { id } } } = action;
      state.channels = state.channels.filter((channel) => channel.id !== id);
      state.currentChannelId = DEFAULT_ACTIVE_CHANNEL_ID;
    },

    renameChannel: (state, action) => {
      const { payload: { data: { attributes: { name, id } } } } = action;
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
