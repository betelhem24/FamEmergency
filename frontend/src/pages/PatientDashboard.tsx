import React from 'react';
import { useSelector } from 'react-redux';
import { QRCodeSVG } from 'qrcode.react';
// I import the type-only RootState to satisfy your TS config
import type { RootState } from '../store';

const PatientDashboard: React.FC = () => {
  // I extract the user object from our Redux auth state
  const { user } = useSelector((state: RootState) => state.auth);

  // I prepare the data string for the QR code
  const medicalData = JSON.stringify({
    id: user?.id,
    name: user?.name,
    history: "Blood Type: O+, No Allergies",
  });

  return (
    <div className="login-container"> {/* I reuse the centering logic from Login */}
      {/* I apply the 'glass-card' class to give it the frosted look */}
      <div className="glass-card">
        <h1 style={{ marginBottom: '10px' }}>Patient Portal</h1>
        <p>Welcome, <strong>{user?.name}</strong></p>
        
        <div style={{ 
          marginTop: '30px', 
          background: 'white', // We keep the QR background white so it is easy to scan
          padding: '15px', 
          borderRadius: '15px',
          display: 'inline-block' 
        }}>
          <QRCodeSVG value={medicalData} size={200} level="H" />
        </div>
        
        <p style={{ marginTop: '20px', fontSize: '0.9rem', opacity: 0.8 }}>
          Emergency responders can scan this code to view your vital info.
        </p>
        
        <button 
          className="login-button" 
          style={{ marginTop: '20px', background: 'rgba(255,255,255,0.1)', border: '1px solid white' }}
          onClick={() => window.location.reload()}
        >
          Update History
        </button>
      </div>
    </div>
  );
};

export default PatientDashboard;