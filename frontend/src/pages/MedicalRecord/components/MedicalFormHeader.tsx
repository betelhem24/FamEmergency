import React from 'react';

interface HeaderProps {
    doctorName?: string;
}

const MedicalFormHeader: React.FC<HeaderProps> = ({ doctorName = "Unknown" }) => {
    return (
        <header className="form-header">
            <h2>Medical Record Form</h2>
            <p className="form-subtitle">Doctor ({doctorName})</p>
        </header>
    );
};

export default MedicalFormHeader;
