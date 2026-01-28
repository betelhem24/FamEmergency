import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from './store';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';

// Components
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  // I pull the user info to handle role-based redirection
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        {/* If logged in, I redirect them away from Login/Register to the home logic */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />

        {/* Home Logic: Redirects user based on their specific role */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              {user?.role === 'DOCTOR' ? (
                <Navigate to="/doctor-dashboard" replace />
              ) : (
                <Navigate to="/patient-dashboard" replace />
              )}
            </ProtectedRoute>
          } 
        />

        {/* Patient Route: Protected by Guard */}
        <Route 
          path="/patient-dashboard" 
          element={
            <ProtectedRoute>
              <PatientDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Doctor Route: Protected by Guard */}
        <Route 
          path="/doctor-dashboard" 
          element={
            <ProtectedRoute>
              <DoctorDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Fallback: Send any unknown link to the home logic */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;