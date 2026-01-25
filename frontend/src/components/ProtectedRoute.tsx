import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import type { RootState } from '../store'; // Word: Added 'type' here
import React from 'react'; 

interface ProtectedRouteProps {
  children: React.ReactNode; 
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  //  Now TS knows exactly what shape 'state' is
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;