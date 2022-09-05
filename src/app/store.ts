import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import chatsReducer from "../features/chats/chatsSlice";
import messagesReducer from "../features/messages/messagesSlice";
import usersReducer from "../features/users/usersSlice";

export const store = configureStore({
  reducer: {
    chats: chatsReducer,
    messages: messagesReducer,
    users: usersReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;