import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { QrReader } from 'react-qr-reader';
import type { RootState } from '../store';

const DoctorDashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [scanResult, setScanResult] = useState<string | null>(null);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Doctor Dashboard</h1>
      <p>Medical Helper: <strong>{user?.name}</strong></p>

      <div style={{ maxWidth: '400px', margin: '0 auto', border: '2px solid #007bff', borderRadius: '10px' }}>
        <h3>Scan Patient QR Code</h3>
        
        {/* I use the QrReader component from the version 3 library */}
        <QrReader
          // I handle the result and any errors inside this one prop
          onResult={(result, error) => {
            if (!!result) {
              setScanResult(result.getText());
            }
            if (!!error) {
              // I ignore common 'no QR found' noise to keep the console clean
            }
          }}
          // I tell it to use the back camera
          constraints={{ facingMode: 'environment' }}
          // I set the width of the camera container
          containerStyle={{ width: '100%' }}
        />
      </div>

      {scanResult && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
          <h4>Patient Data:</h4>
          <pre style={{ textAlign: 'left', whiteSpace: 'pre-wrap' }}>{scanResult}</pre>
          <button onClick={() => setScanResult(null)}>Clear and Scan Again</button>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;