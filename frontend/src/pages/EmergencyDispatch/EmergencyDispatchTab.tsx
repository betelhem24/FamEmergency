import React from 'react';
import { EmergencySOSButton } from '../../components/Emergency/EmergencySOSButton';
import { GlassCard } from '../../components/UI/GlassCard';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

export const EmergencyDispatchTab: React.FC = () => {
    const activeEmergency = useSelector((state: RootState) => state.emergency.activeEmergency);

    return (
        <div style={{ padding: '1rem' }}>
            <GlassCard size="lg" className="fade-in text-center">
                <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                    Emergency Alert
                </h2>

                {activeEmergency ? (
                    <div>
                        <div style={{
                            padding: '1rem',
                            background: 'rgba(239, 68, 68, 0.2)',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: '1rem'
                        }}>
                            <h3 style={{ color: 'var(--danger)', marginBottom: '0.5rem' }}>
                                🚨 EMERGENCY ACTIVE
                            </h3>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                Type: {activeEmergency.type}
                            </p>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                Triggered at: {new Date(activeEmergency.triggeredAt).toLocaleTimeString()}
                            </p>
                        </div>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            Your emergency contacts have been notified
                        </p>
                    </div>
                ) : (
                    <>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                            Press the SOS button to alert your emergency contacts
                        </p>
                        <EmergencySOSButton />
                    </>
                )}
            </GlassCard>
        </div>
    );
};
