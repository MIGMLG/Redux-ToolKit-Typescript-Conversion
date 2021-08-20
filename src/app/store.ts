import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import notificationsSlice from '../features/notifications/notificationsSlice';

import postsReducer from '../features/posts/postsSlice';
import usersSlice from '../features/users/usersSlice';

export const store = configureStore({
  reducer: {
    postsState: postsReducer,
    users: usersSlice,
    notifications: notificationsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();