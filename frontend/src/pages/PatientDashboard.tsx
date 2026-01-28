import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { QRCodeSVG } from 'qrcode.react';
import type { RootState } from '../store';
import './Dashboard.css';

const PatientDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  interface MongoUser { _id?: string; name?: string; email?: string; role?: string; }
  const userData = user as MongoUser;

  const qrData = JSON.stringify({ id: userData?._id, name: userData?.name });

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>My ID</h1>
        <button className="logout-btn-small" onClick={() => dispatch(logout())}>Logout</button>
      </header>
      <div className="dashboard-grid">
        <section className="glass-card">
          <h3>Emergency QR</h3>
          <div style={{ background: 'white', padding: '15px', borderRadius: '15px', display: 'flex', justifyContent: 'center' }}>
            <QRCodeSVG value={qrData} size={200} level="H" />
          </div>
        </section>
        <section className="glass-card">
          <h3>Profile</h3>
          <p><strong>Name:</strong> {userData?.name}</p>
          <p><strong>Email:</strong> {userData?.email}</p>
          <p><strong>ID:</strong> {userData?._id?.substring(0, 8)}</p>
        </section>
      </div>
    </div>
  );
};
export default PatientDashboard;