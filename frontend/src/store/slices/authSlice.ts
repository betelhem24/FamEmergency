import { createSlice } from '@reduxjs/toolkit';
// I use 'import type' for PayloadAction to satisfy the verbatimModuleSyntax rule
import type { PayloadAction } from '@reduxjs/toolkit';

// I define the user structure
interface User {
  id: number;
  name: string;
  email: string;
  role: 'PATIENT' | 'DOCTOR';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // I handle login and store the user role
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;