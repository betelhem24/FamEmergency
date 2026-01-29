import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import type { RootState } from '../../store';
import { setActiveEmergency } from '../../store/slices/emergencySlice';
import { useSocketEvents } from '../../hooks/useSocketEvents';
import { GlassCard } from '../UI/GlassCard';
import { Button } from '../UI/Button';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const EmergencySOSButton: React.FC = () => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const { emitEmergency } = useSocketEvents();
    const token = useSelector((state: RootState) => state.auth.token);
    const myLocation = useSelector((state: RootState) => state.location.myLocation);

    const handleTriggerSOS = async () => {
        if (!myLocation) {
            alert('Please enable location services');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                `${API_URL}/api/emergency/trigger`,
                {
                    type: 'SOS',
                    severity: 'CRITICAL',
                    location: {
                        latitude: myLocation.latitude,
                        longitude: myLocation.longitude
                    }
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const emergency = response.data.emergency;
            dispatch(setActiveEmergency(emergency));
            emitEmergency(emergency._id);
            setShowConfirm(false);
        } catch (error) {
            console.error('Failed to trigger emergency:', error);
            alert('Failed to trigger emergency');
        } finally {
            setLoading(false);
        }
    };

    if (showConfirm) {
        return (
            <GlassCard size="lg" className="text-center">
                <h2 style={{ marginBottom: '1rem', color: 'var(--danger)' }}>
                    Trigger Emergency Alert?
                </h2>
                <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                    This will notify all your emergency contacts immediately.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <Button variant="danger" onClick={handleTriggerSOS} loading={loading}>
                        Confirm SOS
                    </Button>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>
                        Cancel
                    </Button>
                </div>
            </GlassCard>
        );
    }

    return (
        <button
            onClick={() => setShowConfirm(true)}
            style={{
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                border: '4px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(239, 68, 68, 0.4)',
                transition: 'all 0.3s ease',
                margin: '2rem auto',
                display: 'block'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(239, 68, 68, 0.6)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(239, 68, 68, 0.4)';
            }}
        >
            SOS
        </button>
    );
};
