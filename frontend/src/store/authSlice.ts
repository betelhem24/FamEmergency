// I added 'type' before PayloadAction to follow strict 2026 TS rules
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';


// 1. THE CONTRACT
interface AuthState {
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  token: string | null;
}

// 2. THE STARTING STATE
const initialState: AuthState = {
  user: null,
  token: null,
};

// 3. THE LOGIC
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // I use the 'type' PayloadAction here to measure our data package
    setCredentials: (state, action: PayloadAction<{ user: any; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;