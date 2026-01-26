// I import configureStore to create the main Redux heart
import { configureStore } from '@reduxjs/toolkit';
// I import the authReducer from its NEW location in the slices folder
import authReducer from './slices/authSlice';

// I create the store and tell it to use the authReducer
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// I export these types so TypeScript knows exactly what is inside my store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;