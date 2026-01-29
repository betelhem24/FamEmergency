import React from 'react';
import { Users, Navigation, Plus } from 'lucide-react';
import AnalyticsChart from '../../../components/AnalyticsChart';
import StatCard from '../../../components/StatCard';

const MedicalStats: React.FC = () => {
    return (
        <div className="stats-section">
            <StatCard
                title="Total Patients Scanned"
                value="4,452"
                subtitle="GOOD"
                icon={Users}
                color="#00d2ff"
            />

            <div className="glass-card chart-container">
                <AnalyticsChart />
            </div>

            <button className="add-record-btn">
                <Plus size={32} />
            </button>

            <button className="directions-btn">
                <Navigation size={20} />
                Directions to Emergency
            </button>
        </div>
    );
};

export default MedicalStats;
