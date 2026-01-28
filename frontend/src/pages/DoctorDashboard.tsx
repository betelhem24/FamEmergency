import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { QrReader } from 'react-qr-reader';
import type { RootState } from '../store';
import './Dashboard.css';

const DoctorDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  // I handle scanning states
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  // I fix the red line by allowing 'undefined' as the library requires
  const handleScanResult = (result: any | null | undefined) => {
    if (result) {
      setScanResult(result.getText());
      setIsScanning(false); 
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Medical Control</h1>
        <button className="logout-btn-small" onClick={() => dispatch(logout())}>Logout</button>
      </header>

      <div className="dashboard-grid">
        <section className="glass-card">
          <h3>Scanner</h3>
          <div className="scanner-container">
            {isScanning ? (
              <>
                <QrReader
                  onResult={handleScanResult}
                  constraints={{ facingMode }}
                  containerStyle={{ width: '100%' }}
                />
                <button className="camera-flip-btn" onClick={() => setFacingMode(f => f === 'user' ? 'environment' : 'user')}>🔄</button>
              </>
            ) : <p>Offline</p>}
          </div>
          <button className="action-btn" onClick={() => setIsScanning(!isScanning)}>
            {isScanning ? 'Stop' : 'Start'}
          </button>
        </section>

        <section className="glass-card">
          <h3>Physician</h3>
          <div className="profile-details">
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Status:</strong> <span className="status-online">Online</span></p>
          </div>
        </section>

        <section className="glass-card">
          <h3>Results</h3>
          {scanResult ? <pre className="history-data">{scanResult}</pre> : <p>No Data</p>}
        </section>
      </div>
    </div>
  );
};

export default DoctorDashboard;