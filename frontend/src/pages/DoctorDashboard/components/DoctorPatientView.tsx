import React from 'react';
import { GlassCard } from '../../../components/UI/GlassCard';

interface Props {
    data: any;
    onClose: () => void;
}

export const DoctorPatientView: React.FC<Props> = ({ data, onClose }) => {
    return (
        <div className="fade-in">
            <button onClick={onClose} className="glass-button mb-4" style={{ marginBottom: '1rem' }}>
                ← Back to Dashboard
            </button>

            <GlassCard size="lg">
                <div style={{
                    borderBottom: '1px solid var(--glass-border)',
                    paddingBottom: '1rem',
                    marginBottom: '1rem'
                }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>{data.fullName}</h2>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                        <span style={{ background: 'var(--primary)', padding: '2px 8px', borderRadius: '4px' }}>
                            Blood: {data.bloodType}
                        </span>
                        <span style={{ background: 'var(--secondary)', padding: '2px 8px', borderRadius: '4px' }}>
                            DOB: {new Date(data.dob).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    <div>
                        <h3 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Allergies</h3>
                        <p className="glass-input">{data.allergies || 'None reported'}</p>
                    </div>
                    <div>
                        <h3 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Emergency Contact</h3>
                        <div className="glass-input">
                            <p>Name: {data.emergencyContact}</p>
                            <p>Relation: {data.relationship}</p>
                        </div>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
};
