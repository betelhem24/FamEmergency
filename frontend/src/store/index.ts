import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

// Word-by-Word: configureStore connects all your slices into one big brain
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// These are Pro-TypeScript types we will use later to "read" from the brain
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;