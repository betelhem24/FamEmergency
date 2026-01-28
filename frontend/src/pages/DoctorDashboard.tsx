import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { QrReader } from 'react-qr-reader';
import type { RootState } from '../store';
import './Dashboard.css';

// I define the structure of the scan result to satisfy TypeScript
interface IScanResult {
  getText(): string;
}

const DoctorDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  // I use state to manage the scanner and the result
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  // I handle the data once the camera finds a QR code
  const handleScanResult = (result: IScanResult | null) => {
    if (result) {
      setScanResult(result.getText());
      setIsScanning(false); // I stop the lens to save battery
    }
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Medical Control</h1>
        <button className="logout-btn-small" onClick={() => dispatch(logout())}>
          Logout
        </button>
      </header>

      <div className="dashboard-grid">
        {/* Scanner Card */}
        <section className="glass-card">
          <h3>Medical Scanner</h3>
          <div className="scanner-container">
            {isScanning ? (
              <>
                <QrReader
                  onResult={handleScanResult}
                  constraints={{ facingMode }}
                  containerStyle={{ width: '100%', height: '100%' }}
                />
                <button className="camera-flip-btn" onClick={toggleCamera}>🔄</button>
              </>
            ) : (
              <div className="placeholder-ui">
                <p>Scanner is Offline</p>
                <span style={{ fontSize: '40px' }}>📷</span>
              </div>
            )}
          </div>
          <button 
            className={`action-btn ${isScanning ? 'stop' : ''}`} 
            onClick={() => setIsScanning(!isScanning)}
          >
            {isScanning ? 'Stop Scanner' : 'Start Scanner'}
          </button>
        </section>

        {/* Doctor Info Card */}
        <section className="glass-card">
          <h3>Physician Details</h3>
          <div className="profile-details">
            <p><strong>Doctor:</strong> {user?.name}</p>
            <p><strong>Specialty:</strong> Emergency Medicine</p>
            <p><strong>Status:</strong> <span className="status-online">Online</span></p>
          </div>
        </section>

        {/* Results Card */}
        <section className="glass-card">
          <h3>Scan Results</h3>
          {scanResult ? (
            <div className="results-box">
              <p style={{ color: '#10b981' }}>✓ Patient Identified</p>
              <pre className="history-data">{scanResult}</pre>
              <button className="action-btn-outline" onClick={() => setScanResult(null)}>
                Clear Data
              </button>
            </div>
          ) : (
            <p className="qr-hint">Waiting for scanner data...</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default DoctorDashboard;