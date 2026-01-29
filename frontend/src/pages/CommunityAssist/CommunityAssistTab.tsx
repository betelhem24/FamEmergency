import React from 'react';
import { GlassCard } from '../../components/UI/GlassCard';
import { LiveMap } from '../../components/Map/LiveMap';

export const CommunityAssistTab: React.FC = () => {
    return (
        <div style={{ padding: '1rem' }}>
            <GlassCard size="md" className="fade-in">
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                    Community Assist
                </h2>

                <LiveMap />

                <div style={{ marginTop: '1rem' }}>
                    <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                        Nearby Emergency Services
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        📍 Map shows your current location and nearby emergency services
                    </p>
                </div>
            </GlassCard>
        </div>
    );
};
