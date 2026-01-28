import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// I create the login messenger that talks to the backend
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (userData: Record<string, string>, thunkAPI) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', userData);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Login failed');
      }
      return thunkAPI.rejectWithValue('An unexpected error occurred');
    }
  }
);

// I create the registration messenger to talk to the backend
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: Record<string, string>, thunkAPI) => {
    try {
      // I call the register route on your backend port 5000
      const response = await axios.post('http://localhost:5000/api/auth/register', userData);
      
      // If the backend sends a token immediately after registration, I save it
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data;
    } catch (error: unknown) {
      // I handle the error specifically for Axios
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Registration failed');
      }
      return thunkAPI.rejectWithValue('An unexpected error occurred');
    }
  }
);