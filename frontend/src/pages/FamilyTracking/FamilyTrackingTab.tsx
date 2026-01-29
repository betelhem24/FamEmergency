import React, { useEffect } from 'react';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useSocketEvents } from '../../hooks/useSocketEvents';
import { GlassCard } from '../../components/UI/GlassCard';
import { LiveMap } from '../../components/Map/LiveMap';
import { StatusBadge } from '../../components/UI/StatusBadge';

export const FamilyTrackingTab: React.FC = () => {
    const { startTracking, stopTracking } = useGeolocation();

    useSocketEvents(); // Initialize socket event listeners

    useEffect(() => {
        const id = startTracking();

        return () => {
            if (id) stopTracking(id);
        };
    }, []);

    return (
        <div style={{ padding: '1rem' }}>
            <GlassCard size="md" className="fade-in">
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem'
                }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                        Family Tracking
                    </h2>
                    <StatusBadge status="online" pulse />
                </div>

                <LiveMap />

                <div style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
                    <p>📍 Real-time location sharing active</p>
                    <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                        Your location is being shared with family members
                    </p>
                </div>
            </GlassCard>
        </div>
    );
};
