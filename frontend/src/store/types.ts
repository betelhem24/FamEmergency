// I define the user structure
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'PATIENT' | 'DOCTOR';
}

// I define the structure of our authentication state
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}