import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../store';
import React from 'react'; // Word: Added to use React.ReactNode

// Word-by-Word: We define an Interface to tell TS exactly what 'children' is
interface ProtectedRouteProps {
  children: React.ReactNode; 
}

// Word-by-Word: We use the interface here instead of 'any'
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    // Word: If the brain is empty, redirect to login
    return <Navigate to="/login" replace />;
  }

  // Word: If user exists, render the secret children components
  return <>{children}</>;
};

export default ProtectedRoute;