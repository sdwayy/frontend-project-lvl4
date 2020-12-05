import { createSlice } from '@reduxjs/toolkit';

const messagesSlice = createSlice({
  name: 'messagesInfo',
  initialState: {
    messages: [],
  },
  reducers: {
    addMessage(state, payload) {
      return [...state, payload.newMessage]
    },
  },
});

export const { addMessage } = messagesSlice.actions;
export default messagesSlice.reducer;