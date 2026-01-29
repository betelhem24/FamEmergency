import React from 'react';
import type { MedicalFieldProps } from '../types';

const MedicalEmergencyFields: React.FC<MedicalFieldProps> = ({ formData, handleChange }) => {
    return (
        <div className="form-row">
            <div className="form-group">
                <label>Emergency Contact</label>
                <input
                    type="text"
                    name="emergencyContact"
                    placeholder="Insert Name"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                />
            </div>
            <div className="form-group">
                <label>Relationship to</label>
                <input
                    type="text"
                    name="relationship"
                    placeholder="Ex:teammate"
                    value={formData.relationship}
                    onChange={handleChange}
                />
            </div>
        </div>
    );
};

export default MedicalEmergencyFields;
