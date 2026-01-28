import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { QRCodeSVG } from 'qrcode.react';
import type { RootState } from '../store';
import './Dashboard.css';

const PatientDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  // I use a temporary interface to tell TS about the MongoDB ID
  interface MongoUser {
    _id?: string;
    name?: string;
    email?: string;
    role?: string;
  }
  
  const userData = user as MongoUser;

  const qrData = JSON.stringify({
    id: userData?._id,
    name: userData?.name,
    role: userData?.role,
    timestamp: new Date().toISOString()
  });

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>My Medical ID</h1>
        <button className="logout-btn-small" onClick={() => dispatch(logout())}>Logout</button>
      </header>

      <div className="dashboard-grid">
        <section className="glass-card">
          <h3>Emergency QR Code</h3>
          <div className="qr-wrapper">
            <QRCodeSVG value={qrData} size={200} level="H" includeMargin={true} />
          </div>
          <p className="qr-hint">Show this to a doctor in case of emergency.</p>
        </section>

        <section className="glass-card">
          <h3>Patient Profile</h3>
          <div className="profile-details">
            <p><strong>Full Name:</strong> {userData?.name}</p>
            <p><strong>Email:</strong> {userData?.email}</p>
            <p><strong>Account ID:</strong> {userData?._id?.substring(0, 8)}...</p>
            <p><strong>Status:</strong> <span className="status-online">Active</span></p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PatientDashboard;