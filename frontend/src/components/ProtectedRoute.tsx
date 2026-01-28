import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

// I define the props to accept other React components as "children"
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // I check the Redux "Brain" to see if the user is logged in
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  // If the app is still checking the token, I show nothing or a spinner
  if (loading) {
    return <div>Loading...</div>;
  }

  // If the user is NOT authenticated, I redirect them to /login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If they ARE authenticated, I show the private page (children)
  return <>{children}</>;
};

export default ProtectedRoute;