import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { QRCodeSVG } from 'qrcode.react';
import type { RootState } from '../store';
import './Dashboard.css';

const PatientDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  // I create a string of data to be stored inside the QR code
  const qrData = JSON.stringify({
    id: user?._id,
    name: user?.name,
    role: user?.role,
    timestamp: new Date().toISOString()
  });

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>My Medical ID</h1>
        <button className="logout-btn-small" onClick={() => dispatch(logout())}>Logout</button>
      </header>

      <div className="dashboard-grid">
        {/* QR Identification Card */}
        <section className="glass-card">
          <h3>Emergency QR Code</h3>
          <div className="qr-wrapper">
            <QRCodeSVG value={qrData} size={200} level="H" includeMargin={true} />
          </div>
          <p className="qr-hint">Show this to a doctor in case of emergency.</p>
        </section>

        {/* Profile Information Card */}
        <section className="glass-card">
          <h3>Patient Profile</h3>
          <div className="profile-details">
            <p><strong>Full Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Account ID:</strong> {user?._id?.substring(0, 8)}...</p>
            <p><strong>Status:</strong> <span className="status-online">Active</span></p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PatientDashboard;