import { createSlice } from '@reduxjs/toolkit';

const channelsSlice = createSlice({
  name: 'channelsInfo',
  initialState: {
    channels: [],
    currentChannelId: 1,
  },
  reducers: {
    newChannel: (state, action) => {
      const { payload: { data: { attributes } } } = action;
      state.channels.push(attributes);
    },

    swapChannel: (state, action) => {
      const { payload }= action;
      state.currentChannelId = payload;
    },

    removeChannel: (state, action) => {
      const { payload: { data: { id } } } = action;
      state.channels = state.channels.filter((channel) => channel.id !== id)
    },

    renameChannel: (state, action) => {
      const { payload: { data: { attributes: { name, id } } } } = action;
      const modifiedChannel = state
        .channels
        .find((channel) => channel.id === id);

        modifiedChannel.name = name
    }
  },
});

export const {
  newChannel,
  removeChannel,
  swapChannel,
  renameChannel
} = channelsSlice.actions;
export default channelsSlice.reducer;