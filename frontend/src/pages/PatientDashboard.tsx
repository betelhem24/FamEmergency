// I import React and the QR Code generator component
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { QRCodeSVG } from 'qrcode.react';

const PatientDashboard: React.FC = () => {
  // I grab the user information from the Redux store
  const { user } = useSelector((state: RootState) => state.auth);

  // I create a string of data that the QR code will represent
  // In a professional app, this would be a link to a secure API
  const medicalData = JSON.stringify({
    id: user?.id,
    name: user?.name,
    history: "No known allergies, Blood Type: O+",
  });

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Patient Dashboard</h1>
      <p>Welcome, <strong>{user?.name}</strong></p>
      
      <div style={{ marginTop: '50px', background: 'white', padding: '20px', display: 'inline-block' }}>
        <h3>Your Medical QR Code</h3>
        
        {/* I render the QR code using the SVG format for high quality */}
        <QRCodeSVG 
          value={medicalData} 
          size={256}
          level={"H"} // I use 'High' error correction so it scans even if slightly damaged
          includeMargin={true}
        />
        
        <p style={{ color: '#666', fontSize: '14px' }}>
          Show this to your doctor to share your history.
        </p>
      </div>
    </div>
  );
};

export default PatientDashboard;