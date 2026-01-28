import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { QrReader } from 'react-qr-reader';
import type { RootState } from '../store';
import './Dashboard.css';

// I define the interface so TypeScript understands the scanner result
interface IQrResult {
  getText(): string;
}

const DoctorDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  // I handle the data found by the camera
  const handleScanResult = (result: IQrResult | null | undefined) => {
    if (result) {
      setScanResult(result.getText());
      setIsScanning(false); // I turn off the camera after a successful scan
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Medical Control</h1>
        <button className="logout-btn-small" onClick={() => dispatch(logout())}>Logout</button>
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
                  // I use these styles to force the video to be visible and fill the card
                  videoStyle={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  containerStyle={{ width: '100%', height: '100%' }}
                />
                <button className="camera-flip-btn" onClick={() => setFacingMode(f => f === 'user' ? 'environment' : 'user')}>🔄</button>
              </>
            ) : (
              <div className="placeholder-ui">
                <p>Scanner Offline</p>
                <span style={{ fontSize: '40px' }}>📷</span>
              </div>
            )}
          </div>
          <button className="action-btn" onClick={() => setIsScanning(!isScanning)}>
            {isScanning ? 'Stop Scanner' : 'Start Scanner'}
          </button>
        </section>

        {/* Physician Info */}
        <section className="glass-card">
          <h3>Physician Details</h3>
          <div className="profile-details">
            <p><strong>Doctor:</strong> {user?.name}</p>
            <p><strong>Status:</strong> <span className="status-online">Online</span></p>
          </div>
        </section>

        {/* Scan History/Result */}
        <section className="glass-card">
          <h3>Scan Results</h3>
          {scanResult ? (
            <div className="results-box">
              <pre className="history-data">{scanResult}</pre>
              <button className="action-btn" style={{background: 'transparent', border: '1px solid var(--glass-border)'}} onClick={() => setScanResult(null)}>Clear</button>
            </div>
          ) : <p className="qr-hint">No data scanned yet.</p>}
        </section>
      </div>
    </div>
  );
};

export default DoctorDashboard;