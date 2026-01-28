import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { QrReader } from 'react-qr-reader';
import type { RootState } from '../store';

const DoctorDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [scanResult, setScanResult] = useState<string | null>(null);

  return (
    <div className="dashboard-container">
      {/* Top Navigation Bar */}
      <header className="dashboard-header">
        <h1>Medical Control</h1>
        <button className="logout-btn-small" onClick={() => dispatch(logout())}>
          Logout
        </button>
      </header>

      {/* Responsive Grid Layout */}
      <div className="dashboard-grid">
        
        {/* Card 1: The Scanner (Main Action) */}
        <section className="glass-card scanner-section">
          <h3>Medical Scanner</h3>
          <div className="scanner-container">
            <QrReader
              onResult={(result) => {
                if (result) {
                  setScanResult(result.getText());
                }
              }}
              constraints={{ facingMode: 'environment' }}
              containerStyle={{ width: '100%', borderRadius: '15px', overflow: 'hidden' }}
            />
          </div>
          <p className="scanner-hint">Scan Patient's QR ID for instant history</p>
        </section>

        {/* Card 2: Doctor Profile & Stats */}
        <section className="glass-card info-section">
          <h3>Physician Details</h3>
          <div className="profile-details">
            <p><strong>Doctor:</strong> {user?.name}</p>
            <p><strong>Specialty:</strong> Emergency Medicine</p>
            <p><strong>System Status:</strong> <span className="status-online">Online</span></p>
          </div>
        </section>

        {/* Card 3: Scan Results (Only shows when data is found) */}
        <section className="glass-card results-section">
          <h3>Scan Results</h3>
          {scanResult ? (
            <div className="scan-content">
              <pre className="history-data">{scanResult}</pre>
              <button className="action-btn" onClick={() => setScanResult(null)}>
                Clear & Scan Next
              </button>
            </div>
          ) : (
            <p className="placeholder-text">Waiting for scanner data...</p>
          )}
        </section>

      </div>
    </div>
  );
};

export default DoctorDashboard;