import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 1. THE CONTRACT (Interface)
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

// 3. THE SLICE (The Logic)
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    //  setCredentials takes the user data and "writes" it to the brain
    setCredentials: (state, action: PayloadAction<{ user: any; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    //  logout "wipes" the brain clean
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;