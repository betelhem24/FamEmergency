import React from 'react';

const MedicalFormActions: React.FC = () => {
    return (
        <div className="form-actions">
            <button type="submit" className="submit-btn">
                Save & Generate QR
            </button>
            <button type="button" className="cancel-btn">
                Cancel
            </button>
        </div>
    );
};

export default MedicalFormActions;
