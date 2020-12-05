import { createSlice } from '@reduxjs/toolkit';

const channelsSlice = createSlice({
  name: 'channelsInfo',
  initialState: {
    channels: [],
    currentChannelId: 1,
  },
  reducers: {
    add: (state, action) => [...state, action.payload.channel],
    remove: (state, action) => state.filter((channel) => channel.id !== action.payload.id),
  },
});

export default channelsSlice.reducer;