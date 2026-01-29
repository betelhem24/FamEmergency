import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import emergencyReducer from './slices/emergencySlice';
import locationReducer from './slices/locationSlice';
import familyReducer from './slices/familySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    emergency: emergencyReducer,
    location: locationReducer,
    family: familyReducer,
  },
});

export type { EmergencyState } from './slices/emergencySlice';
export type { LocationState } from './slices/locationSlice';
export type { FamilyState } from './slices/familySlice';
export type { AuthState } from './types';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;