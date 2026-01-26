// I import the necessary tools from React and React Router
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store';

// I import the different page components
import Login from './pages/Login';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';

const App: React.FC = () => {
  // I pull the user and authentication status from the Redux store
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <Router>
      <Routes>
        {/* I define the public Login route */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />

        {/* I define the logic for the Home path '/' */}
        <Route 
          path="/" 
          element={
            !isAuthenticated ? (
              <Navigate to="/login" />
            ) : user?.role === 'DOCTOR' ? (
              <Navigate to="/doctor-dashboard" />
            ) : (
              <Navigate to="/patient-dashboard" />
            )
          } 
        />

        {/* I protect the Patient Dashboard: only PATIENT role can enter */}
        <Route 
          path="/patient-dashboard" 
          element={
            isAuthenticated && user?.role === 'PATIENT' ? <PatientDashboard /> : <Navigate to="/login" />
          } 
        />

        {/* I protect the Doctor Dashboard: only DOCTOR role can enter */}
        <Route 
          path="/doctor-dashboard" 
          element={
            isAuthenticated && user?.role === 'DOCTOR' ? <DoctorDashboard /> : <Navigate to="/login" />
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;