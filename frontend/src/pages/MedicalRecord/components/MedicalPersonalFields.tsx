import React from 'react';
import type { MedicalFieldProps } from '../types';

const MedicalPersonalFields: React.FC<MedicalFieldProps> = ({ formData, handleChange }) => {
    return (
        <>
            <div className="form-group">
                <label>Full Name</label>
                <input type="text" name="fullName" placeholder="Dr. Patient's Name" value={formData.fullName} onChange={handleChange} />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Date / Type</label>
                    <input type="text" name="dateType" placeholder="Dr. Patient's Name" value={formData.dateType} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Date of Birth</label>
                    <input type="date" name="dob" placeholder="Date/MM/DD" value={formData.dob} onChange={handleChange} />
                </div>
            </div>

            <div className="form-group">
                <label>Blood Type</label>
                <select name="bloodType" value={formData.bloodType} onChange={handleChange}>
                    <option value="">Select Blood Type</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                </select>
            </div>

            <div className="form-group">
                <label>Allergies/Conditions</label>
                <textarea name="allergies" rows={3} value={formData.allergies} onChange={handleChange} />
            </div>
        </>
    );
};

export default MedicalPersonalFields;
