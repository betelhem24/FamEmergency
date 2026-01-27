import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
// I import the logout action to clear the Redux memory
import { logout } from '../store/slices/authSlice';
import { QRCodeSVG } from 'qrcode.react';
import type { RootState } from '../store';

const PatientDashboard: React.FC = () => {
  // I initialize 'dispatch' so I can call the logout function
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const medicalData = JSON.stringify({
    id: user?.id,
    name: user?.name,
    history: "Blood Type: O+, No Allergies",
  });

  // I create a function to handle the exit process
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="login-container">
      <div className="glass-card">
        {/* I add a Logout button at the top right of the card */}
        <div style={{ textAlign: 'right' }}>
          <button 
            onClick={handleLogout}
            style={{ 
              background: 'rgba(255, 0, 0, 0.2)', 
              border: '1px solid rgba(255, 255, 255, 0.3)', 
              color: 'white',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Logout
          </button>
        </div>

        <h1>Patient Portal</h1>
        <p>Welcome, <strong>{user?.name}</strong></p>
        
        <div style={{ background: 'white', padding: '15px', borderRadius: '15px', display: 'inline-block', marginTop: '20px' }}>
          <QRCodeSVG value={medicalData} size={180} level="H" />
        </div>
        
        <p style={{ marginTop: '20px', fontSize: '0.8rem' }}>
          Your unique Medical ID for emergencies.
        </p>
      </div>
    </div>
  );
};

export default PatientDashboard;