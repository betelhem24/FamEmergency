import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { QRCodeSVG } from 'qrcode.react';
import type { RootState } from '../store';

const PatientDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const medicalData = JSON.stringify({
    id: user?.id,
    name: user?.name,
    history: "Blood Type: O+, No Allergies",
  });

  return (
    <div className="dashboard-container">
      {/* Top Navigation Bar */}
      <header className="dashboard-header">
        <h1>Patient Portal</h1>
        <button className="logout-btn-small" onClick={() => dispatch(logout())}>
          Logout
        </button>
      </header>

      {/* Responsive Grid Layout */}
      <div className="dashboard-grid">
        
        {/* Card 1: The Medical ID (QR Code) */}
        <section className="glass-card qr-section">
          <h3>Digital Medical ID</h3>
          <div className="qr-wrapper">
            <QRCodeSVG value={medicalData} size={150} level="H" />
          </div>
          <p className="qr-hint">Show this to a doctor in an emergency</p>
        </section>

        {/* Card 2: Personal Information */}
        <section className="glass-card info-section">
          <h3>Patient Profile</h3>
          <div className="profile-details">
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Blood Type:</strong> O+</p>
          </div>
        </section>

        {/* Card 3: Emergency Contacts (Ready for next task) */}
        <section className="glass-card contacts-section">
          <h3>Emergency Contacts</h3>
          <p className="placeholder-text">No contacts added yet.</p>
          <button className="action-btn-outline">+ Add Contact</button>
        </section>

      </div>
    </div>
  );
};

export default PatientDashboard;