import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// I import the logout action to allow the doctor to sign out
import { logout } from '../store/slices/authSlice';
import { QrReader } from 'react-qr-reader';
import type { RootState } from '../store';

const DoctorDashboard: React.FC = () => {
  const dispatch = useDispatch();
  // I pull the doctor's info from the 'Global Memory' (Redux)
  const { user } = useSelector((state: RootState) => state.auth);
  // I create a 'state' to hold the text we get from the QR code
  const [scanResult, setScanResult] = useState<string | null>(null);

  return (
    <div className="login-container">
      <div className="glass-card" style={{ maxWidth: '500px' }}>
        {/* Logout Section */}
        <div style={{ textAlign: 'right' }}>
          <button className="login-button" style={{ width: 'auto', padding: '5px 15px', background: 'rgba(255,255,255,0.1)' }} onClick={() => dispatch(logout())}>
            Logout
          </button>
        </div>

        <h2>Medical Scanner</h2>
        <p>Doctor: <strong>{user?.name}</strong></p>

        {/* Camera Container with Glass Border */}
        <div style={{ 
          marginTop: '20px', 
          border: '2px solid var(--glass-border)', 
          borderRadius: '15px', 
          overflow: 'hidden',
          background: '#000' 
        }}>
          <QrReader
            onResult={(result, error) => {
              // If the camera 'sees' a code, I save the text
              if (result) {
                setScanResult(result.getText());
              }
            }}
            // I tell the device to use the back camera ('environment')
            constraints={{ facingMode: 'environment' }}
            containerStyle={{ width: '100%' }}
          />
        </div>

        {/* Results Section: Only shows if 'scanResult' is not empty */}
        {scanResult && (
          <div style={{ 
            marginTop: '20px', 
            padding: '15px', 
            background: 'rgba(255, 255, 255, 0.1)', 
            borderRadius: '10px',
            textAlign: 'left'
          }}>
            <h4 style={{ margin: '0 0 10px 0' }}>Patient History:</h4>
            {/* I display the raw text data found in the QR */}
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>{scanResult}</pre>
            <button className="login-button" onClick={() => setScanResult(null)}>Scan Next Patient</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;