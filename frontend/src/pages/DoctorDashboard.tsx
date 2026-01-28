import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { QrReader } from 'react-qr-reader';
import type { RootState } from '../store';
import './Dashboard.css';

interface IQrResult { getText(): string; }

const DoctorDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  const handleScanResult = (result: IQrResult | null | undefined) => {
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
                  videoStyle={{ width: '100%', height: '100%' }}
                />
                <button className="camera-flip-btn" onClick={() => setFacingMode(p => p === 'user' ? 'environment' : 'user')}>🔄</button>
              </>
            ) : <p>Ready to Scan</p>}
          </div>
          <button className="action-btn" onClick={() => setIsScanning(!isScanning)}>
            {isScanning ? 'Stop Scanner' : 'Start Scanner'}
          </button>
        </section>

        <section className="glass-card">
          <h3>Details</h3>
          <p>Doctor: {user?.name}</p>
          <div style={{ marginTop: '10px', padding: '10px', background: 'rgba(0,0,0,0.2)' }}>
            <strong>Result:</strong> {scanResult || "Waiting for scan..."}
          </div>
        </section>
      </div>
    </div>
  );
};
export default DoctorDashboard;