import { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import type { MedicalFormData } from './types';
import MedicalFormHeader from './components/MedicalFormHeader';
import MedicalPersonalFields from './components/MedicalPersonalFields';
import MedicalEmergencyFields from './components/MedicalEmergencyFields';
import MedicalFormActions from './components/MedicalFormActions';
import MedicalStats from './components/MedicalStats';
import { QRCodeSVG } from 'qrcode.react'; // We use the fix directly
import './MedicalForm.css';

const MedicalRecordForm: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [qrCodeData, setQrCodeData] = useState<string | null>(null);
    const [formData, setFormData] = useState<MedicalFormData>({
        fullName: '', dateType: '', dob: '', bloodType: '',
        allergies: '', emergencyContact: '', relationship: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = { ...formData, userId: user?.id || 'guest' };
            const res = await axios.post('http://localhost:5000/api/medical', payload);
            // We set the QR code to the returned ID
            setQrCodeData(res.data.recordId);
            alert('Medical Record Saved!');
        } catch (error) {
            console.error(error);
            alert('Failed to save record.');
        }
    };

    return (
        <div className="medical-form-container">
            <MedicalFormHeader doctorName={user?.name} />
            <div className="form-layout">
                <div className="form-section glass-card">
                    {qrCodeData ? (
                        <div className="qr-success">
                            <h3>Record Saved!</h3>
                            <QRCodeSVG value={qrCodeData} size={200} />
                            <p>Scan this code to retrieve history.</p>
                            <button className="action-btn" onClick={() => setQrCodeData(null)}>New Form</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <MedicalPersonalFields formData={formData} handleChange={handleChange} />
                            <MedicalEmergencyFields formData={formData} handleChange={handleChange} />
                            <MedicalFormActions />
                        </form>
                    )}
                </div>
                <MedicalStats />
            </div>
        </div>
    );
};

export default MedicalRecordForm;
