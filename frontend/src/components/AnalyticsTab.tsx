import React from 'react';
import { GlassCard } from './UI/GlassCard';

export const AnalyticsTab: React.FC = () => {
    return (
        <div style={{ padding: '1rem' }}>
            <GlassCard>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Settings & Analytics</h2>
                <p style={{ color: 'var(--text-secondary)' }}>
                    User statistics and configuration options will appear here.
                </p>
            </GlassCard>
        </div>
    );
};
