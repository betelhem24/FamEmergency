// I import createSlice to build a piece of the global state
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// I define exactly what a User looks like using an Interface
interface User {
  id: number;
  name: string;
  email: string;
  role: 'PATIENT' | 'DOCTOR'; // I strictly allow only these two roles
}

// I define the shape of my Auth state
interface AuthState {
  user: User | null;      // I start with no user logged in
  token: string | null;   // I start with no digital ID (token)
  isAuthenticated: boolean; 
}

// I set the starting values for the app
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

// I create the Slice which contains the logic for changing the state
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // I handle the successful login here
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;   // I save the user details (including role)
      state.token = action.payload.token; // I save the security token
      state.isAuthenticated = true;       // I mark the user as logged in
    },
    // I handle logging out to clear the memory
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

// I export the actions so I can call them from my Login page
export const { loginSuccess, logout } = authSlice.actions;
// I export the reducer to add it to the main store
export default authSlice.reducer;